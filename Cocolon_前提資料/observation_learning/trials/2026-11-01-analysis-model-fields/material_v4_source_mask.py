"""Compact Analysis JSON syntax and same-field source-quotation grammar.

This is a request-scoped lexical mask, not a meaning reader. It receives only
the prepared input's field ordinals/texts. All node/scope/qualifier enums and
all allowed list lengths remain selectable; the existing admission/typed
reader owns their meaning and relationships. Strings use Python's canonical
ensure_ascii=False JSON escaping. No teacher, expected answer or case ID enters
this module.

Reuse syntax2b.TokenMask and SyntaxProcessor unchanged:
    processor = SyntaxProcessor(engine, prompt_length)
    processor.state = Grammar(material["fields"]).initial_state()

State.mode is always empty, so TokenMask cannot use its unrestricted-string
fast path. TokenMask's verified byte trie, token checks and EOS logic remain
in force. Grammar identity participates in State hashing to prevent cached
token masks from being reused for a different request's source text.
"""

from dataclasses import dataclass
import json


NODE_KINDS = (
    'SCENE', 'ROLE', 'ATTENTION_OR_THOUGHT', 'ACTION_OR_NONACTION',
    'IMMEDIATE_RESULT_OR_AFTERMATH',
)
SCOPE_ROLES = (
    'CONTENT_TARGET', 'UNKNOWN_CONTENT', 'ATTRIBUTIVE_CONTENT',
    'TE_CONTEXT', 'WRITTEN_REASON', 'WRITTEN_UNKNOWN',
)
QUALIFIER_KINDS = (
    'NEGATION', 'EPISTEMIC_EXPRESSION', 'RELATIVE_TIME',
    'WRITTEN_MODIFIER', 'REASON_MARKER', 'EXPLICIT_ACTOR',
)

# Stack task tags. Payloads are small integer IDs, ordinals, counts or bitsets.
_LITERAL, _ENUM, _SOURCE, _MATCH, _PARENT = range(5)
_FIELD, _UNITS, _AFTER_UNITS, _UNIT = range(5, 9)
_QUALIFIERS, _AFTER_QUALIFIERS, _QUALIFIER = range(9, 12)


def _json_bytes(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'),
                      allow_nan=False).encode('utf-8')


class _SourceLexicon:
    """O(source bytes) storage for every character-aligned source substring.

    Match positions are bitsets of byte offsets in the canonically escaped
    source. Every source-character boundary can start a quote. A closing JSON
    quote is allowed only at character boundaries; counting these end offsets
    counts overlapping source occurrences too. No O(n**2) substring catalogue
    or semantic selection is constructed.
    """

    __slots__ = ('byte_masks', 'starts', 'ends', 'nonspace_ends')

    def __init__(self, text):
        masks = [0] * 256
        starts = ends = nonspace_ends = 0
        offset = 0
        for character in text:
            starts |= 1 << offset
            chunk = _json_bytes(character)[1:-1]
            for byte in chunk:
                masks[byte] |= 1 << offset
                offset += 1
            ends |= 1 << offset
            if not character.isspace():
                nonspace_ends |= 1 << offset
        self.byte_masks = tuple(masks)
        self.starts = starts
        self.ends = ends
        self.nonspace_ends = nonspace_ends


@dataclass(frozen=True, slots=True)
class State:
    grammar: object
    stack: tuple

    @property
    def mode(self):
        return ''

    @property
    def aux(self):
        return 0

    @property
    def complete(self):
        return not self.stack

    def step(self, byte):
        return self.grammar._step(self.stack, byte)

    def feed(self, data):
        state = self
        for byte in data:
            state = state.step(byte)
            if state is None:
                return None
        return state


class Grammar:
    """Only compact schema structure and lexical source membership are bound.

    Unit quote and parent_quote require a unique, nonblank substring of the
    corresponding field. Qualifier quotes may repeat in that field because
    their eventual containing unit, validated afterwards, determines their
    uniqueness. Forward parent references remain possible. Node-kind/scope
    combinations, duplicate semantic units, qualifier meaning and omission
    are deliberately not decided here.
    """

    __slots__ = ('field_texts', '_lexicons', '_literals', '_literal_ids',
                 '_enum_nodes', '_enum_terminal', '_node_enum', '_scope_enum',
                 '_qualifier_enum', '_root_sequence', '_fields', '_units',
                 '_qualifiers')

    def __init__(self, fields):
        if not isinstance(fields, (list, tuple)):
            raise TypeError('analysis_fields_list_required')
        texts = []
        for ordinal, field in enumerate(fields, 1):
            if (type(field) is not dict or type(field.get('field')) is not int
                    or field['field'] != ordinal or type(field.get('text')) is not str):
                raise ValueError('analysis_field_ordinal_or_text_invalid')
            texts.append(field['text'])
        self.field_texts = tuple(texts)
        interned = {}
        self._lexicons = []
        for text in texts:
            if text not in interned:
                interned[text] = _SourceLexicon(text)
            self._lexicons.append(interned[text])
        self._lexicons = tuple(self._lexicons)
        self._literals, self._literal_ids = [], {}
        self._enum_nodes, self._enum_terminal = [], []
        self._node_enum = self._enum((None,) + NODE_KINDS)
        self._scope_enum = self._enum((None,) + SCOPE_ROLES)
        self._qualifier_enum = self._enum(QUALIFIER_KINDS)
        self._fields, self._units, self._qualifiers = [], [], []
        root = [self._literal('{"fields":[')]
        for index in range(len(texts)):
            if index:
                root.append(self._literal(','))
            root.append((_FIELD, index))
            self._fields.append((
                self._literal('{"field":' + str(index + 1) + ',"units":['),
                (_UNITS, index, 0, True), self._literal('}'),
            ))
            self._units.append((
                self._literal('{"node_kind":'), (_ENUM, self._node_enum),
                self._literal(',"parent_quote":'), (_PARENT, index),
                self._literal(',"qualifiers":['), (_QUALIFIERS, index, 0, True),
                self._literal(',"quote":'), (_SOURCE, index, True),
                self._literal(',"scope_role":'), (_ENUM, self._scope_enum),
                self._literal('}'),
            ))
            self._qualifiers.append((
                self._literal('{"kind":'), (_ENUM, self._qualifier_enum),
                self._literal(',"quote":'), (_SOURCE, index, False),
                self._literal('}'),
            ))
        root.append(self._literal(']}'))
        self._root_sequence = tuple(root)

    def _literal(self, text):
        data = text.encode('utf-8')
        if data not in self._literal_ids:
            self._literal_ids[data] = len(self._literals)
            self._literals.append(data)
        return (_LITERAL, self._literal_ids[data], 0)

    def _enum(self, values):
        root = len(self._enum_nodes)
        self._enum_nodes.append({})
        self._enum_terminal.append(False)
        for value in values:
            current = root
            for byte in _json_bytes(value):
                children = self._enum_nodes[current]
                if byte not in children:
                    children[byte] = len(self._enum_nodes)
                    self._enum_nodes.append({})
                    self._enum_terminal.append(False)
                current = children[byte]
            self._enum_terminal[current] = True
        return root

    def initial_state(self):
        return State(self, tuple(reversed(self._root_sequence)))

    def _step(self, stack, byte):
        if type(byte) is not int or not 0 <= byte <= 255:
            raise ValueError('byte_required')
        while stack:
            task, rest = stack[-1], stack[:-1]
            kind = task[0]
            if kind == _LITERAL:
                data, position = self._literals[task[1]], task[2]
                if byte != data[position]:
                    return None
                tail = () if position + 1 == len(data) else (
                    (_LITERAL, task[1], position + 1),)
                return State(self, rest + tail)
            if kind == _ENUM:
                following = self._enum_nodes[task[1]].get(byte)
                if following is None:
                    return None
                tail = () if self._enum_terminal[following] else ((_ENUM, following),)
                return State(self, rest + tail)
            if kind == _SOURCE:
                if byte != 34:
                    return None
                lexicon = self._lexicons[task[1]]
                return State(self, rest + ((_MATCH, task[1], task[2],
                                           lexicon.starts, False),))
            if kind == _MATCH:
                _, field, unique, positions, nonspace = task
                lexicon = self._lexicons[field]
                endings = positions & lexicon.ends
                if (byte == 34 and nonspace and endings
                        and (not unique or endings.bit_count() == 1)):
                    return State(self, rest)
                following = (positions & lexicon.byte_masks[byte]) << 1
                if not following:
                    return None
                nonspace = nonspace or bool(following & lexicon.nonspace_ends)
                return State(self, rest + ((_MATCH, field, unique, following, nonspace),))
            if kind == _PARENT:
                if byte == 110:
                    stack = rest + (self._literal('null'),)
                    continue
                stack = rest + ((_SOURCE, task[1], True),)
                continue
            if kind == _FIELD:
                stack = rest + tuple(reversed(self._fields[task[1]]))
                continue
            if kind in (_UNITS, _QUALIFIERS):
                _, field, count, can_close = task
                limit = 8 if kind == _UNITS else 6
                if byte == 93 and can_close:
                    return State(self, rest)
                if byte != 123 or count >= limit:
                    return None
                after = _AFTER_UNITS if kind == _UNITS else _AFTER_QUALIFIERS
                child = _UNIT if kind == _UNITS else _QUALIFIER
                stack = rest + ((after, field, count + 1), (child, field))
                continue
            if kind in (_AFTER_UNITS, _AFTER_QUALIFIERS):
                _, field, count = task
                if byte == 93:
                    return State(self, rest)
                limit = 8 if kind == _AFTER_UNITS else 6
                if byte != 44 or count >= limit:
                    return None
                child = _UNITS if kind == _AFTER_UNITS else _QUALIFIERS
                return State(self, rest + ((child, field, count, False),))
            if kind in (_UNIT, _QUALIFIER):
                sequence = self._units[task[1]] if kind == _UNIT else self._qualifiers[task[1]]
                stack = rest + tuple(reversed(sequence))
                continue
            raise AssertionError('unknown_analysis_grammar_task')
        return None
