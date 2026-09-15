#!/usr/bin/env python3
"""Build a transportable test environment, never execute Emlis or private data in CI."""
import concurrent.futures
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import tarfile
import urllib.request
import urllib.parse

API_HEAD = 'ce8466253b99fcf0992a8b5c3ca38284d1fb5ef0'
APP_HEAD = '6a073151facb674efa412e80451403dd50f8bfa6'
LOCK = 'ai/configs/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_lock_v1.json'
PBS_RELEASE = '20260623'
PYTHON_VERSION = '3.12.13'
NODE_VERSION = '22.16.0'
PGLITE_VERSION = '0.5.8'
ROOT = Path(os.environ['RUNNER_TEMP']) / 'emlis-pro-build'
BUNDLE = ROOT / 'emlis-pro-runtime'
DOWNLOADS = ROOT / 'downloads'
OUT = Path(os.environ['RUNNER_TEMP']) / 'emlis-pro-artifacts'
HEAD = os.environ['EXPECTED_HEAD_SHA']


def run(*args, **kwargs):
    return subprocess.check_output(list(map(str, args)), text=True, **kwargs).strip()


def get(url):
    # All URLs are public distribution endpoints; never use a GitHub token here.
    request = urllib.request.Request(url, headers={'User-Agent': 'cocolon-emlis-runtime-builder'})
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read()


def sha(data):
    return hashlib.sha256(data).hexdigest()


def save_verified(url, target, expected):
    assert re.fullmatch('[0-9a-f]{64}', expected)
    data = get(url)
    assert sha(data) == expected, f'distribution hash mismatch: {target.name}'
    target.write_bytes(data)
    return {'filename': target.name, 'sha256': expected, 'bytes': len(data), 'source': url}


def extract(archive, destination):
    destination.mkdir(parents=True, exist_ok=True)
    with tarfile.open(archive) as package:
        # Python's data filter rejects traversal, device files and escaping links.
        package.extractall(destination, filter='data')


def checkout(repo, head, target):
    assert re.fullmatch('[0-9a-f]{40}', head)
    target.mkdir(parents=True)
    run('git', 'init', '-q', target)
    run('git', '-C', target, 'remote', 'add', 'origin', f'https://github.com/MassyuRed/{repo}.git')
    run('git', '-C', target, 'fetch', '--no-tags', '--depth=1', 'origin', head)
    run('git', '-C', target, 'checkout', '-q', '--detach', head)
    assert run('git', '-C', target, 'rev-parse', 'HEAD') == head
    return target


def copy_sources(source, target):
    # Deliberately a documented text-source snapshot, not a full Git checkout.
    # Do not ship .env, credential files, prior Git history, native binaries or media/fonts.
    included, excluded = [], []
    extensions = {'.py', '.js', '.cjs', '.mjs', '.jsx', '.ts', '.tsx', '.json', '.sql',
                  '.md', '.txt', '.yml', '.yaml', '.toml', '.ini', '.cfg', '.lock', '.sh',
                  '.jsonl', '.csv', '.tsv', '.ndjson'}
    for name in run('git', '-C', source, 'ls-files', '-z').split('\0'):
        if not name:
            continue
        rel = Path(name)
        lower = name.lower()
        fixture_data = rel.suffix.lower() in {'.jsonl', '.csv', '.tsv', '.ndjson'}
        allowed_fixture = name.startswith(('ai/tests/fixtures/', 'tests/fixtures/'))
        blocked = ((fixture_data and not allowed_fixture)
                   or any(part.startswith('.env') for part in rel.parts)
                   or any(word in lower for word in ['credential', 'service_account', 'service-account', 'private_key'])
                   or (rel.suffix.lower() not in extensions and rel.name not in {'.gitignore', '.gitattributes'}))
        path = source / rel
        if blocked or path.is_symlink() or not path.is_file():
            excluded.append(name)
            continue
        data = path.read_bytes()
        try:
            data.decode('utf-8')
        except UnicodeDecodeError:
            excluded.append(name)
            continue
        destination = target / rel
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(data)
        included.append({'path': name, 'sha256': sha(data), 'git_blob': hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()})
    return {'files': included, 'excluded_paths': excluded, 'is_full_checkout': False}



def add_sparse_git_metadata(source, target, source_map):
    """Keep the real current commit/trees, but only allowed file blobs; no history."""
    import zlib
    head = run('git', '-C', source, 'rev-parse', 'HEAD')
    root_tree = run('git', '-C', source, 'rev-parse', 'HEAD^{tree}')
    run('git', 'init', '-q', target)
    gitdir = target / '.git'
    shutil.rmtree(gitdir / 'hooks', ignore_errors=True)

    def store(kind, data, expected=None):
        raw = kind.encode() + b' ' + str(len(data)).encode() + b'\0' + data
        identity = hashlib.sha1(raw).hexdigest()
        if expected is not None:
            assert identity == expected, 'Git object identity mismatch'
        path = gitdir / 'objects' / identity[:2] / identity[2:]
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(zlib.compress(raw))
        return identity

    tree_ids = {root_tree}
    listing = subprocess.check_output(['git', '-C', str(source), 'ls-tree', '-r', '-t', '-z', head])
    for entry in listing.split(b'\0'):
        if entry:
            fields = entry.split(b'\t', 1)[0].split()
            if fields[1] == b'tree':
                tree_ids.add(fields[2].decode())
    for kind, identity in [('commit', head), *[('tree', t) for t in sorted(tree_ids)]]:
        raw = subprocess.check_output(['git', '-C', str(source), 'cat-file', kind, identity])
        store(kind, raw, identity)
    for entry in source_map['files']:
        store('blob', (target / entry['path']).read_bytes(), entry['git_blob'])
    # Standard non-cone sparse checkout: excluded blobs are neither present nor
    # claimed to have been read. No real source file is assume-unchanged.
    def escape(name):
        return '/' + ''.join('\\' + c if c in '\\*?[]!' else c for c in name)
    (gitdir / 'info/sparse-checkout').write_text(
        '\n'.join(escape(e['path']) for e in source_map['files']) + '\n')
    (gitdir / 'HEAD').write_text(head + '\n')
    (gitdir / 'shallow').write_text(head + '\n')
    run('git', '-C', target, 'config', 'core.sparseCheckout', 'true')
    run('git', '-C', target, 'config', 'core.sparseCheckoutCone', 'false')
    run('git', '-C', target, 'read-tree', '--reset', '-u', 'HEAD')
    assert run('git', '-C', target, 'rev-parse', 'HEAD') == head
    assert run('git', '-C', target, 'rev-parse', 'HEAD^{tree}') == root_tree
    assert not run('git', '-C', target, 'status', '--porcelain', '--untracked-files=all')
    flags = subprocess.check_output(['git', '-C', str(target), 'ls-files', '-v', '-z'])
    included = {e['path'] for e in source_map['files']}
    for entry in flags.split(b'\0'):
        if entry:
            flag, name = entry[:1], entry[2:].decode()
            assert (flag == b'H') == (name in included), 'incorrect sparse inclusion'
    source_map['source_tree'] = root_tree
    source_map['git_metadata'] = 'EXACT_HEAD_AND_TREES_ALLOWED_BLOBS_ONLY_SHALLOW_SPARSE'
    source_map['excluded_blob_bodies_included'] = False


def main():
    assert not ROOT.exists(), 'refuse to mix an earlier build'
    DOWNLOADS.mkdir(parents=True)
    BUNDLE.mkdir()
    OUT.mkdir(parents=True)
    api = checkout('mashos-api', API_HEAD, ROOT / 'checkout-api')
    app = checkout('Cocolon', APP_HEAD, ROOT / 'checkout-app')
    lock_bytes = (api / LOCK).read_bytes()
    lock = json.loads(lock_bytes)
    assert lock['distribution_count'] == len(lock['distributions']) == 46
    assert lock['target']['python_version'] == PYTHON_VERSION
    (BUNDLE / 'python-dependencies.lock.json').write_bytes(lock_bytes)
    requirements = '\n'.join(lock['pip_require_hashes_lines']) + '\n'
    (BUNDLE / 'requirements.lock').write_text(requirements)

    python_name = f'cpython-{PYTHON_VERSION}+{PBS_RELEASE}-x86_64-unknown-linux-gnu-install_only_stripped.tar.gz'
    release = json.loads(get(f'https://api.github.com/repos/astral-sh/python-build-standalone/releases/tags/{PBS_RELEASE}'))
    assets = [asset for asset in release['assets'] if asset['name'] == python_name]
    assert len(assets) == 1, 'pinned Python distribution not found'
    asset = assets[0]
    assert asset.get('digest', '').startswith('sha256:'), 'Python asset digest missing'
    python_url = asset['browser_download_url']
    python_hash = asset['digest'].split(':', 1)[1]
    python_receipt = save_verified(python_url, DOWNLOADS / python_name, python_hash)
    extract(DOWNLOADS / python_name, BUNDLE)
    python = BUNDLE / 'python/bin/python3'
    assert run(python, '-c', 'import platform;print(platform.python_version())') == PYTHON_VERSION

    node_name = f'node-v{NODE_VERSION}-linux-x64.tar.xz'
    node_base = f'https://nodejs.org/dist/v{NODE_VERSION}/'
    checksums = get(node_base + 'SHASUMS256.txt').decode().splitlines()
    matches = [line.split()[0] for line in checksums if line.split()[-1] == node_name]
    assert len(matches) == 1
    node_receipt = save_verified(node_base + node_name, DOWNLOADS / node_name, matches[0])
    extract(DOWNLOADS / node_name, BUNDLE)
    (BUNDLE / f'node-v{NODE_VERSION}-linux-x64').rename(BUNDLE / 'node')
    assert run(BUNDLE / 'node/bin/node', '--version') == 'v' + NODE_VERSION

    wheelhouse = BUNDLE / 'wheelhouse'
    wheelhouse.mkdir()
    def fetch_wheel(item):
        filename = item['wheel_filename']
        assert filename == Path(filename).name and filename.endswith('.whl')
        metadata = json.loads(get('https://pypi.org/pypi/' + item['normalized_distribution_name'] + '/' + item['distribution_version'] + '/json'))
        matches = [entry for entry in metadata['urls'] if entry['filename'] == filename and entry['digests']['sha256'] == item['wheel_sha256']]
        assert len(matches) == 1, 'locked wheel unavailable: ' + filename
        url = matches[0]['url']
        assert urllib.parse.urlparse(url).hostname == 'files.pythonhosted.org'
        return save_verified(url, wheelhouse / filename, item['wheel_sha256'])
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        wheels = list(pool.map(fetch_wheel, lock['distributions']))
    subprocess.run([str(python), '-m', 'pip', 'install', '--disable-pip-version-check', '--no-index',
                    '--no-deps', '--no-compile', '--require-hashes', '--find-links', str(wheelhouse),
                    '--target', str(BUNDLE / 'site-packages'), '-r', str(BUNDLE / 'requirements.lock')], check=True, timeout=300)
    # Exact package inventory; never count packages supplied by the chat host.
    inventory_code = 'import importlib.metadata as m,json;print(json.dumps({d.metadata["Name"].lower().replace("_","-"):d.version for d in m.distributions(path=[' + repr(str(BUNDLE / 'site-packages')) + '])},sort_keys=True))'
    inventory = json.loads(run(python, '-c', inventory_code))
    expected = {entry['normalized_distribution_name']: entry['distribution_version'] for entry in lock['distributions']}
    assert inventory == expected, 'installed distribution set differs from the fixed 46'

    # PGlite is self-contained: inspect metadata and verify the registry integrity.
    metadata = json.loads(get('https://registry.npmjs.org/@electric-sql/pglite/' + PGLITE_VERSION))
    assert not metadata.get('dependencies'), 'new dependencies require an explicit lock'
    import base64
    raw = get(metadata['dist']['tarball'])
    integrity = 'sha512-' + base64.b64encode(hashlib.sha512(raw).digest()).decode()
    assert integrity == metadata['dist']['integrity']
    pglite_archive = DOWNLOADS / 'pglite.tgz'
    pglite_archive.write_bytes(raw)
    scope = BUNDLE / 'node_modules/@electric-sql'
    extract(pglite_archive, scope)
    (scope / 'package').rename(scope / 'pglite')
    assert json.loads((scope / 'pglite/package.json').read_text())['version'] == PGLITE_VERSION

    source_maps = {}
    for repo, head, source in [('mashos-api', API_HEAD, api), ('Cocolon', APP_HEAD, app)]:
        source_maps[repo] = copy_sources(source, BUNDLE / 'sources' / repo)
        source_maps[repo]['commit'] = head
        add_sparse_git_metadata(source, BUNDLE / 'sources' / repo, source_maps[repo])
    # Include only the existing SC entry and settings, for connection/repair without executing its indexer.
    implementation = Path(os.environ['GITHUB_WORKSPACE'])
    sc_files = ['Cocolon_前提資料/system_context/00_read_first.md',
                'Cocolon_前提資料/system_context/workspace_profiles.json',
                'Cocolon_前提資料/system_context/task_profiles.json']
    # Exact current implementation inputs needed to update/verify Context.
    sc_files += sorted(str(p.relative_to(implementation)) for directory, pattern in
                       [('tools', 'cocolon_context*'), ('tests/cocolon_context', '*.py'),
                        ('.devcontainer', '**/*'), ('.github/workflows', '*.yml')]
                       for p in (implementation / directory).glob(pattern)
                       if p.is_file() and not p.is_symlink())
    for name in sc_files:
        dest = BUNDLE / 'system-context-implementation' / name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(implementation / name, dest)
    shutil.copyfile(implementation / 'tools/emlis_pro_runtime_build.py', BUNDLE / 'build_recipe.py')
    shutil.copyfile(implementation / 'tools/emlis_pro_runtime_run.py', BUNDLE / 'run_tests.py')
    receipt = {'schema_version': 'cocolon.emlis_pro_runtime.v1', 'implementation_head': HEAD,
               'status': 'BUILT_NOT_YET_VERIFIED_IN_PRO', 'system_context_cache_refreshed': False,
               'python': python_receipt, 'node': node_receipt, 'python_inventory': inventory,
               'python_lock_path': LOCK, 'python_lock_sha256': sha(lock_bytes),
               'wheels': wheels, 'pglite': {'version': PGLITE_VERSION, 'integrity': integrity, 'sha256': sha(raw)},
               'sources': source_maps, 'product_tests_run_in_ci': 0, 'private_data_included': False,
               'source_snapshot_is_full_checkout': False,
               'remaining': ['Pro relocation/startup and existing persistent test', 'full inherited evaluations', 'current System Context prepare']}
    (BUNDLE / 'manifest.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
    # All runtime and source bytes are independently verifiable after transport.
    hashes = []
    for path in sorted(BUNDLE.rglob('*')):
        if path.is_file() and not path.is_symlink():
            hashes.append(sha(path.read_bytes()) + '  ' + path.relative_to(BUNDLE).as_posix())
    (BUNDLE / 'SHA256SUMS').write_text('\n'.join(hashes) + '\n')
    archive = OUT / 'emlis-pro-runtime.tar.gz'
    with tarfile.open(archive, 'w:gz', compresslevel=3) as stream:
        stream.add(BUNDLE, arcname=BUNDLE.name)
    digest = sha(archive.read_bytes())
    (OUT / 'archive.sha256').write_text(digest + '  ' + archive.name + '\n')
    (OUT / 'build-summary.json').write_text(json.dumps({'implementation_head': HEAD, 'api_head': API_HEAD,
        'app_head': APP_HEAD, 'python': PYTHON_VERSION, 'distributions': len(inventory), 'pglite': PGLITE_VERSION,
        'status': 'BUILT_NOT_YET_VERIFIED_IN_PRO', 'sha256': digest, 'bytes': archive.stat().st_size}, indent=2) + '\n')
    print('Bundle built; no product test or product acceptance is claimed.')


if __name__ == '__main__':
    main()
