"""Disconnected model-wire feasibility only; never an adopted CMEE parser."""
import copy
import json
import re

SCHEMA = 'cocolon.cmee.named_reference_candidate.v1'
QUOTE = 'cocolon.cmee.quote_candidate.v1'
KEYS = {
    'about_time':'time', 'anchor_source_id':'at_source', 'arguments':'args',
    'binding':'bind', 'bindings':'binds', 'claim_id':'cid', 'claim_refs':'cr',
    'claims':'claims', 'conflicts':'conflicts', 'core':'core',
    'description':'description', 'evidence_indexes':'ev', 'expression':'expr',
    'focus':'focus', 'from_claim_id':'from', 'kind':'kind', 'modality':'mode',
    'observation':'observation', 'operation':'op', 'polarity':'polarity',
    'predicate':'pred', 'prior_snapshot_ref':'prior', 'qualifiers':'qual',
    'question_proposal':'question', 'reception':'reception', 'relation_id':'rid',
    'relation_refs':'rr', 'relations':'relations', 'replacement_refs':'replace',
    'schema_version':'schema', 'scope_refs':'scope', 'section':'section',
    'source_entity':'entity', 'subject':'subject', 'surface':'surface',
    'surface_proposal':'prose', 'target_claim_refs':'target_claims',
    'target_kind':'target_kind', 'target_ref':'target',
    'target_unknown_ref':'target_unknown', 'text':'text', 'to_claim_id':'to',
    'type':'type', 'unknown_id':'uid', 'unknowns':'unknowns',
    'update_note':'update_note', 'update_refs':'ur', 'updates':'updates',
    'value':'value',
}
INVERSE = {v:k for k,v in KEYS.items()}
assert len(INVERSE) == len(KEYS)
NAME = re.compile(r'[A-Za-z][A-Za-z0-9_]{0,79}\Z')


def require(ok, reason):
    if not ok:
        raise ValueError(reason)


def loads(raw):
    def pairs(items):
        out = {}
        for k,v in items:
            require(k not in out, 'duplicate_key')
            out[k] = v
        return out
    def bad(_):
        raise ValueError('non_finite_json')
    return json.loads(raw, object_pairs_hook=pairs, parse_constant=bad)


def dump(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'), allow_nan=False)


def label(prefix, value, used):
    base = prefix + re.sub('[^A-Za-z0-9_]', '_', value)[:60]
    name, n = base, 1
    while name in used:
        n += 1
        name = base + '_' + str(n)
    used.add(name)
    return name


def index_names(candidate, quotes):
    """Teacher projection only. Generated packets choose their own unique names."""
    names, used = {}, set()
    for collection, id_key in [('claims','claim_id'), ('relations','relation_id'), ('unknowns','unknown_id')]:
        for item in candidate[collection]:
            for i in item['evidence_indexes']:
                require(type(i) is int and 0 <= i < len(quotes), 'teacher_reference_range')
                if i not in names:
                    names[i] = label('q_', item[id_key], used)
    for i in range(len(quotes)):
        if i not in names:
            names[i] = label('q_', 'extra_' + str(i), used)
    return names


def transform(value, key_map, evidence, updates, decoding=False):
    if isinstance(value, list):
        return [transform(x,key_map,evidence,updates,decoding) for x in value]
    if not isinstance(value, dict):
        return value
    out = {}
    for key, item in value.items():
        require(key in key_map, 'unknown_candidate_key:' + key)
        target = key_map[key]
        kind = target if decoding else key
        if kind in ('evidence_indexes', 'update_refs'):
            table = evidence if kind == 'evidence_indexes' else updates
            require(type(item) is list, 'reference_list_required')
            if decoding:
                require(all(type(x) is str and x in table for x in item), 'undefined_named_reference')
            else:
                require(all(type(x) is int and x in table for x in item), 'teacher_reference_range')
            out[target] = [table[x] for x in item]
        else:
            out[target] = transform(item,key_map,evidence,updates,decoding)
    return out


IDENTITY_FIELDS = {'anchor_source_id', 'prior_snapshot_ref'}


def encode_atoms(candidate, quotes):
    """Intern repeated identity strings only, with all values explicit in output."""
    atoms, reverse = {}, {}
    def intern(value, prefix):
        require(type(value) is str, 'identity_string_required')
        if value not in reverse:
            name=prefix+str(sum(x.startswith(prefix) for x in atoms))
            atoms[name]=value;reverse[value]=name
        return '@'+reverse[value]
    q=copy.deepcopy(quotes)
    for item in q:item['source_id']=intern(item['source_id'],'s')
    def visit(value):
        if isinstance(value,list):return [visit(x) for x in value]
        if not isinstance(value,dict):return value
        return {key:intern(item,'p' if key=='prior_snapshot_ref' else 's') if key in IDENTITY_FIELDS else visit(item)
                for key,item in value.items()}
    return visit(candidate),q,atoms


def decode_atoms(candidate, quotes, atoms):
    require(type(atoms) is dict and all(type(k) is str and NAME.fullmatch(k) and type(v) is str for k,v in atoms.items()),'identity_table_shape')
    used=set()
    def resolve(value):
        require(type(value) is str and value.startswith('@') and value[1:] in atoms,'undefined_identity_alias')
        used.add(value[1:]);return atoms[value[1:]]
    q=copy.deepcopy(quotes)
    for item in q:item['source_id']=resolve(item['source_id'])
    def visit(value):
        if isinstance(value,list):return [visit(x) for x in value]
        if not isinstance(value,dict):return value
        return {key:resolve(item) if key in IDENTITY_FIELDS else visit(item) for key,item in value.items()}
    c=visit(candidate)
    require(used==set(atoms),'unused_identity_alias')
    return c,q


def encode(packet):
    require(type(packet) is dict and set(packet) == {'schema_version','candidate','evidence_quotes'}, 'quote_root')
    require(packet['schema_version'] == QUOTE, 'quote_version')
    candidate, quotes = packet['candidate'], packet['evidence_quotes']
    require(type(candidate) is dict and type(quotes) is list, 'quote_shape')
    candidate,quotes,atoms=encode_atoms(candidate,quotes)
    qnames = index_names(candidate, quotes)
    used = set()
    unames = {i:label('u_', item['operation'].lower() + '_' + item['target_ref'], used)
              for i,item in enumerate(candidate['updates'])}
    c = transform(candidate, KEYS, qnames, unames)
    for i,item in enumerate(c['updates']):
        item['$id'] = unames[i]
    q = []
    for i,item in enumerate(quotes):
        require(set(item) == {'source_id','field_path','quote'}, 'quote_fields')
        q.append({'id':qnames[i], 's':item['source_id'], 'f':item['field_path'], 't':item['quote']})
    return {'v':SCHEMA, 'a':atoms, 'q':q, 'c':c}


def decode(packet):
    require(type(packet) is dict and set(packet) == {'v','a','q','c'}, 'named_root')
    require(packet['v'] == SCHEMA, 'named_version')
    require(type(packet['q']) is list and type(packet['c']) is dict, 'named_shape')
    qnames, quotes = {}, []
    for item in packet['q']:
        require(type(item) is dict and set(item) == {'id','s','f','t'}, 'named_quote_fields')
        name = item['id']
        require(type(name) is str and NAME.fullmatch(name) and name not in qnames, 'duplicate_or_invalid_quote_name')
        require(all(type(item[k]) is str for k in ('s','f','t')), 'quote_value_type')
        qnames[name] = len(quotes)
        quotes.append({'source_id':item['s'], 'field_path':item['f'], 'quote':item['t']})
    c = copy.deepcopy(packet['c'])
    require(type(c.get('updates')) is list, 'updates_required')
    unames = {}
    for i,item in enumerate(c['updates']):
        require(type(item) is dict and '$id' in item, 'update_name_required')
        name = item.pop('$id')
        require(type(name) is str and NAME.fullmatch(name) and name not in unames, 'duplicate_or_invalid_update_name')
        unames[name] = i
    candidate=transform(c, INVERSE, qnames, unames, True)
    candidate,quotes=decode_atoms(candidate,quotes,packet['a'])
    return {'schema_version':QUOTE, 'candidate':candidate, 'evidence_quotes':quotes}


def specification():
    return {
        'schema':SCHEMA,
        'root':{'v':SCHEMA,'a':{'s0':'actual_source_id','p0':'actual_prior_snapshot_ref'},'q':[{'id':'model_chosen_unique_name','s':'@s0','f':'actual_field_path','t':'exact_quote'}],
                'c':'same semantic candidate with the key aliases below'},
        'key_aliases':{k:v for k,v in KEYS.items() if k!=v},
        'references':'ev lists quote names from q; ur lists $id names of output updates; never numeric positions. Every update has unique $id. Other claim/relation/unknown IDs are unchanged.',
        'identity_aliases':'All actual source IDs and prior snapshot IDs are explicit once in a; q.s, at_source and prior contain @name into a. No source or prior ID is supplied by the decoder.',
        'preservation':'All meanings, literal values, source IDs, quotes, question, prose, update operations/order/count/targets and prior snapshot references remain model outputs. No semantic field is filled or repaired. Duplicate/undefined names and incomplete JSON are rejected. This is not an adopted CMEE wire.',
    }
