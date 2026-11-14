"""One-shot optional-wheel target installer and import-only dispatch probe.

This file is not executed on creation. Only the operator runs `install NEW_ROOT`.
No model/tokenizer loading, generation, GPU tensor operation, or base-package install.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib
from importlib.metadata import distribution, distributions, version
import inspect
import json
import os
from pathlib import Path
import platform
import signal
import subprocess
import sys
import time
import traceback
import urllib.request
from urllib.parse import urlparse
import zipfile


LIMIT = 600
BASE = {'torch':'2.8.0+cu128','triton':'3.4.0','transformers':'5.19.0',
        'peft':'0.21.2','accelerate':'1.15.0','safetensors':'0.8.0'}
OPTIONAL = {'causal-conv1d':'1.7.0','fla-core':'0.5.0',
            'flash-linear-attention':'0.5.0','einops':'0.8.1'}
CAUSAL = dict(distribution='causal-conv1d',version='1.7.0',
    filename='causal_conv1d-1.7.0+cu12torch2.8cxx11abiTRUE-cp312-cp312-linux_x86_64.whl',
    source_url='https://github.com/Dao-AILab/causal-conv1d/releases/download/v1.7.0/causal_conv1d-1.7.0%2Bcu12torch2.8cxx11abiTRUE-cp312-cp312-linux_x86_64.whl',
    sha256='a1fcd5d022b67ddfc9e1c291f890004c1c081a03d66b532f6eebe31219168e0e',
    size=196377090)
BINDINGS = (
    ('causal_conv1d_fn', ('causal_conv1d_fn',), 'causal_conv1d', 'causal_conv1d_fn'),
    ('causal_conv1d_update', ('causal_conv1d_update',), 'causal_conv1d', 'causal_conv1d_update'),
    ('chunk_gated_delta_rule', ('torch_chunk_gated_delta_rule','chunk_gated_delta_rule'),
     'fla.ops.gated_delta_rule', 'chunk_gated_delta_rule'),
    ('fused_recurrent_gated_delta_rule', ('torch_recurrent_gated_delta_rule','fused_recurrent_gated_delta_rule'),
     'fla.ops.gated_delta_rule', 'fused_recurrent_gated_delta_rule'),
)


def sha(path):
    value=hashlib.sha256()
    with Path(path).open('rb') as handle:
        for block in iter(lambda:handle.read(1024*1024),b''):value.update(block)
    return value.hexdigest()


def read(path):return json.loads(Path(path).read_text(encoding='utf-8'))


def write(path,value):
    path=Path(path);temp=path.with_name(path.name+'.tmp')
    temp.write_text(json.dumps(value,ensure_ascii=False,sort_keys=True,indent=2,allow_nan=False)+'\n',encoding='utf-8')
    temp.replace(path)


def normalize(name):return name.lower().replace('_','-')


def remaining(start):
    value=LIMIT-(time.monotonic()-start)
    if value<=0:raise TimeoutError('installation_600_second_limit')
    return value


def base_identity():
    assert platform.python_version()=='3.12.3' and platform.machine()=='x86_64'
    items=[]
    for name,expected in BASE.items():
        assert version(name)==expected,(name,version(name),'base_version_mismatch')
        module=importlib.import_module(name)
        origin=Path(module.__file__).resolve()
        items.append(dict(distribution=name,version=version(name),module=name,
            origin=str(origin),origin_sha256=sha(origin),
            distribution_root=str(Path(distribution(name).locate_file('')).resolve())))
    import torch
    assert torch.__version__=='2.8.0+cu128' and torch.version.cuda=='12.8'
    assert bool(torch._C._GLIBCXX_USE_CXX11_ABI) is True
    return dict(python_version=platform.python_version(),machine=platform.machine(),
        torch_version=torch.__version__,torch_cuda=torch.version.cuda,cxx11_abi=True,
        triton_version=version('triton'),packages=items)


def wheel_rows(metadata):
    assert set(metadata)=={'fla-core','flash-linear-attention','einops'}
    rows=[dict(CAUSAL)]
    for name in ('fla-core','flash-linear-attention','einops'):
        entry=metadata[name]
        assert entry['version']==OPTIONAL[name] and len(entry['wheels'])==1
        item=entry['wheels'][0];url=item['url']
        assert urlparse(url).scheme=='https' and urlparse(url).hostname=='files.pythonhosted.org'
        assert Path(item['filename']).name==item['filename'] and item['filename'].endswith('.whl')
        assert len(item['digests']['sha256'])==64 and item['size']>0
        rows.append(dict(distribution=name,version=entry['version'],filename=item['filename'],
            source_url=url,sha256=item['digests']['sha256'],size=item['size']))
    return rows


def download(row,directory,start):
    destination=directory/row['filename'];partial=destination.with_name(destination.name+'.part')
    assert not destination.exists() and not partial.exists()
    request=urllib.request.Request(row['source_url'],headers={'User-Agent':'Cocolon-optional-kernel-one-shot/1'})
    with urllib.request.urlopen(request,timeout=min(30,remaining(start))) as response,partial.open('xb') as handle:
        while True:
            remaining(start);block=response.read(1024*1024)
            if not block:break
            handle.write(block)
            assert handle.tell()<=row['size'],'wheel_download_exceeds_expected_size'
    assert partial.stat().st_size==row['size'] and sha(partial)==row['sha256'],'wheel_identity_mismatch'
    partial.replace(destination)


def wheel_overlap_check(rows,directory):
    """Shared fla namespace files must have equal bytes before one pip transaction."""
    files={};overlap=[]
    for row in rows:
        with zipfile.ZipFile(directory/row['filename']) as archive:
            assert archive.testzip() is None,'wheel_zip_crc'
            for entry in archive.infolist():
                path=Path(entry.filename)
                assert not path.is_absolute() and '..' not in path.parts,'wheel_path_escape'
                if entry.is_dir():continue
                value=hashlib.sha256(archive.read(entry)).hexdigest()
                if entry.filename in files:
                    assert files[entry.filename]==value,('conflicting_wheel_namespace_file',entry.filename)
                    overlap.append(entry.filename)
                files[entry.filename]=value
    return sorted(set(overlap))


def inventory(target):
    return {str(path.relative_to(target)):sha(path) for path in sorted(target.rglob('*'))
        if path.is_file() and '__pycache__' not in path.parts and path.suffix!='.pyc'}


def resolution(bound,vendor):
    """Read existing wrappers only; never patch or substitute a callable."""
    queue=[(bound,[],[])];seen=set()
    while queue:
        actual,path,flags=queue.pop(0)
        if id(actual) in seen or len(path)>6:continue
        seen.add(id(actual))
        if actual is vendor:
            assert all(flags),'reference_implementation_selected'
            return path,flags
        if inspect.isfunction(actual):
            values=inspect.getclosurevars(actual).nonlocals
            if 'implementation' in values:
                assert values.get('is_new_implementation') is True,'reference_implementation_selected'
                queue.append((values['implementation'],path+['closure:implementation'],flags+[True]))
        wrapped=getattr(actual,'__wrapped__',None)
        if wrapped is not None:queue.append((wrapped,path+['__wrapped__'],flags))
    raise AssertionError('vendor_fast_function_identity_unproven')


def probe(args):
    root=args.root;target=(root/'target').resolve()
    manifest=read(root/'manifest.input.json');baseline=manifest['base']
    assert base_identity()==baseline,'base_identity_changed_in_fresh_probe'
    optional=[]
    found={normalize(item.metadata['Name']):item.version for item in distributions(path=[str(target)])}
    assert set(found)==set(OPTIONAL),'unexpected_target_distribution'
    for name,expected in OPTIONAL.items():
        actual=version(name)
        if name=='causal-conv1d':assert actual.split('+',1)[0]==expected
        else:assert actual==expected
        module_name={'causal-conv1d':'causal_conv1d','fla-core':'fla','flash-linear-attention':'fla','einops':'einops'}[name]
        module=importlib.import_module(module_name);origin=Path(module.__file__).resolve()
        assert origin.is_relative_to(target)
        assert Path(distribution(name).locate_file('')).resolve()==target
        optional.append(dict(distribution=name,version=actual,module=module_name,
            origin_relative=str(origin.relative_to(target)),origin_sha256=sha(origin)))
    import causal_conv1d_cuda
    extension=Path(causal_conv1d_cuda.__file__).resolve()
    assert extension.is_relative_to(target),'causal_extension_not_in_isolated_target'
    owner_name='transformers.models.qwen3_5.modeling_qwen3_5'
    owner=importlib.import_module(owner_name)
    bindings=[]
    for logical,attributes,vendor_name,vendor_attribute in BINDINGS:
        vendor=importlib.import_module(vendor_name);vendor_origin=Path(vendor.__file__).resolve()
        assert vendor_origin.is_relative_to(target)
        function=getattr(vendor,vendor_attribute)
        choices=[]
        for attribute in attributes:
            if not hasattr(owner,attribute):continue
            try:path,flags=resolution(getattr(owner,attribute),function)
            except AssertionError:continue
            choices.append((attribute,path,flags))
        assert len(choices)==1,(logical,'qwen35_fast_binding_not_uniquely_proven')
        attribute,path,flags=choices[0]
        bindings.append(dict(binding=logical,owner_module=owner_name,owner_attribute=attribute,
            vendor_module=vendor_name,vendor_attribute=vendor_attribute,
            owner_module_sha256=sha(owner.__file__),vendor_origin_relative=str(vendor_origin.relative_to(target)),
            vendor_module_sha256=sha(vendor_origin),callable_module=function.__module__,
            resolution_path=path,is_new_implementation=True,vendor_identity=True,
            closure_flags=flags,required_closure_flags={'is_new_implementation':True} if flags else {}))
    assert base_identity()==baseline,'base_identity_changed_after_optional_imports'
    manifest.update(status='PROBED_VERIFIED_PENDING_REVIEW',optional_packages=optional,
        vendor_bindings=bindings,availability_checks=[],installed_files=inventory(target),
        causal_extension=dict(origin_relative=str(extension.relative_to(target)),sha256=sha(extension)),
        model_loads=0,tokenizer_loads=0,new_generation=0,new_training=0)
    actual_versions={item['distribution']:item['version'] for item in optional}
    for row in manifest['wheels']:
        row['requested_version']=row['version'];row['version']=actual_versions[row['distribution']]
    write(root/'manifest.verified.json',manifest)


def install(args):
    start=time.monotonic();root=args.root.resolve()
    assert not root.exists(),'new_install_root_required'
    assert len(args.api_commit)==40 and all(x in '0123456789abcdef' for x in args.api_commit)
    assert sha(args.metadata)==args.metadata_sha256
    assert sha(args.v8_pack)==args.v8_pack_sha256
    rows=wheel_rows(read(args.metadata))
    root.mkdir(parents=False);(root/'wheels').mkdir()
    report=dict(status='STARTED',model_loads=0,tokenizer_loads=0,new_generation=0,new_training=0,
        installer_sha256=sha(__file__),limit_seconds=LIMIT)
    write(root/'install.report.json',report)
    try:
        baseline=base_identity();remaining(start)
        for name in OPTIONAL:
            assert not any(normalize(item.metadata['Name'])==name for item in distributions()),('optional_already_in_base',name)
        for row in rows:download(row,root/'wheels',start)
        overlap=wheel_overlap_check(rows,root/'wheels');remaining(start)
        command=[sys.executable,'-m','pip','install','--disable-pip-version-check',
            '--no-input','--no-deps','--no-index','--only-binary=:all:','--no-compile',
            '--target',str(root/'target')]+[str(root/'wheels'/row['filename']) for row in rows]
        with (root/'pip.log').open('wb') as log:
            result=subprocess.run(command,stdout=log,stderr=subprocess.STDOUT,timeout=remaining(start),check=False)
        assert result.returncode==0,('pip_failed',result.returncode)
        assert base_identity()==baseline,'base_identity_changed_after_target_install'
        manifest=dict(schema_version='qwen35_optional_runtime_manifest.v1',status='INSTALL_COMPLETE_PROBE_PENDING',
            api_commit=args.api_commit,target_root=str(root/'target'),base=baseline,wheels=rows,
            metadata_sha256=args.metadata_sha256,shared_namespace_identical_files=overlap,
            inputs=dict(v8_pack_sha256=args.v8_pack_sha256),
            model_loads=0,tokenizer_loads=0,new_generation=0,new_training=0)
        write(root/'manifest.input.json',manifest)
        environment=os.environ.copy();environment['PYTHONPATH']=str(root/'target')
        environment['PYTHONDONTWRITEBYTECODE']='1';environment['PIP_NO_INDEX']='1'
        environment['HF_HUB_OFFLINE']='1';environment['TRANSFORMERS_OFFLINE']='1'
        environment['TRITON_CACHE_DIR']=str(root/'triton-cache')
        with (root/'probe.log').open('wb') as log:
            result=subprocess.run([sys.executable,str(Path(__file__).resolve()),'_probe',str(root)],
                env=environment,stdout=log,stderr=subprocess.STDOUT,timeout=remaining(start),check=False)
        assert result.returncode==0,('fresh_import_probe_failed',result.returncode)
        assert (root/'manifest.verified.json').is_file()
        assert base_identity()==baseline,'base_identity_changed_after_probe'
        report.update(status='PROBED_VERIFIED_PENDING_REVIEW',seconds=time.monotonic()-start,
            manifest_sha256=sha(root/'manifest.verified.json'),base_unchanged=True)
    except BaseException as error:
        report.update(status='FAILED_PARTIAL_NO_RETRY',seconds=time.monotonic()-start,
            error_type=type(error).__name__,error=str(error),traceback=traceback.format_exc())
        write(root/'install.report.json',report)
        raise
    write(root/'install.report.json',report)
    print(json.dumps(dict(status=report['status'],seconds=report['seconds'],root=str(root)),sort_keys=True))


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    modes=parser.add_subparsers(dest='mode',required=True)
    command=modes.add_parser('install');command.add_argument('root',type=Path)
    command.add_argument('--metadata',type=Path,required=True)
    command.add_argument('--metadata-sha256',required=True)
    command.add_argument('--api-commit',required=True)
    command.add_argument('--v8-pack',type=Path,required=True)
    command.add_argument('--v8-pack-sha256',required=True)
    command=modes.add_parser('_probe');command.add_argument('root',type=Path)
    args=parser.parse_args()
    if args.mode=='install':
        def expired(signum,frame):raise TimeoutError('installation_600_second_limit')
        previous=signal.signal(signal.SIGALRM,expired)
        signal.setitimer(signal.ITIMER_REAL,LIMIT)
        try:install(args)
        finally:
            signal.setitimer(signal.ITIMER_REAL,0)
            signal.signal(signal.SIGALRM,previous)
    else:probe(args)


if __name__=='__main__':main()
