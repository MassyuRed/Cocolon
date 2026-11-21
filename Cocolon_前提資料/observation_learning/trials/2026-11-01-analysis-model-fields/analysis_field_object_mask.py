"""Request-scoped Analysis JSON shape only; strings and meaning stay free.

Reuse the frozen syntax2b byte-trie, UTF-8 rules, EOS logic and processor.
Only ordered field ordinals, existing key sets/enums and array maxima are fixed.
No source text, expected quote, semantic answer or case identifier is received.
The existing strict/semantic reader remains responsible for every value.
"""
from dataclasses import dataclass
import json
from syntax2b import utf_step, HEX
from material_v4_source_mask import NODE_KINDS, SCOPE_ROLES, QUALIFIER_KINDS

_LITERAL, _ENUM, _STRING, _PARENT, _FIELD = range(5)
_UNITS, _AFTER_UNITS, _UNIT, _QUALIFIERS, _AFTER_QUALIFIERS, _QUALIFIER = range(5,11)


def literal(text): return (_LITERAL, text.encode('utf-8'))
def enum(values): return (_ENUM, tuple(json.dumps(v,ensure_ascii=False).encode() for v in values))


@dataclass(frozen=True, slots=True)
class State:
    grammar: object
    stack: tuple
    mode: str = ''
    aux: int = 0

    @property
    def complete(self): return not self.stack and not self.mode

    def feed(self, data):
        state=self
        for b in data:
            state=state.step(b)
            if state is None:return None
        return state

    def step(self, b):
        if type(b) is not int or not 0<=b<=255:raise ValueError('byte_required')
        if self.mode=='string':
            if self.aux:
                u=utf_step(self.aux,b)
                return State(self.grammar,self.stack,'string',u) if u>=0 else None
            if b==34:return State(self.grammar,self.stack)
            if b==92:return State(self.grammar,self.stack,'escape')
            if b<32:return None
            u=utf_step(0,b)
            return State(self.grammar,self.stack,'string',u) if u>=0 else None
        if self.mode=='escape':
            if b in b'"\\/bfnrt':return State(self.grammar,self.stack,'string')
            return State(self.grammar,self.stack,'hex',4) if b==117 else None
        if self.mode=='hex':
            if b not in HEX:return None
            return State(self.grammar,self.stack,'hex',self.aux-1) if self.aux>1 else State(self.grammar,self.stack,'string')
        return self.grammar.step(self.stack,b)


class Grammar:
    def __init__(self, ordinals):
        if (type(ordinals) not in (list,tuple) or any(type(n) is not int for n in ordinals)
                or list(ordinals)!=list(range(1,len(ordinals)+1))):
            raise ValueError('ordered_field_ordinals_required')
        self.ordinals=tuple(ordinals)
        root=[literal('{"fields":[')]
        for n in ordinals:
            if n>1:root.append(literal(','))
            root.append((_FIELD,n))
        root.append(literal(']}'))
        self.root=tuple(reversed(root))
        self.unit=(literal('{"node_kind":'),enum((None,)+NODE_KINDS),
            literal(',"parent_quote":'),(_PARENT,),literal(',"qualifiers":['),
            (_QUALIFIERS,0,True),literal(',"quote":'),(_STRING,),
            literal(',"scope_role":'),enum((None,)+SCOPE_ROLES),literal('}'))
        self.qualifier=(literal('{"kind":'),enum(QUALIFIER_KINDS),
            literal(',"quote":'),(_STRING,),literal('}'))

    def initial_state(self):return State(self,self.root)

    def step(self, stack, b):
        while stack:
            task,rest=stack[-1],stack[:-1];kind=task[0]
            if kind==_LITERAL:
                data=task[1]
                if not data or b!=data[0]:return None
                return State(self,rest+(((_LITERAL,data[1:]),) if len(data)>1 else ()))
            if kind==_ENUM:
                tails=tuple(v[1:] for v in task[1] if v and v[0]==b)
                if not tails:return None
                if b'' in tails:
                    assert len(tails)==1,'enum_prefix_overlap'
                    return State(self,rest)
                return State(self,rest+((_ENUM,tails),))
            if kind==_STRING:
                return State(self,rest,'string') if b==34 else None
            if kind==_PARENT:
                stack=rest+((literal('null') if b==110 else (_STRING,)),);continue
            if kind==_FIELD:
                sequence=(literal('{"field":'+str(task[1])+',"units":['),
                    (_UNITS,0,True),literal('}'))
                stack=rest+tuple(reversed(sequence));continue
            if kind in (_UNITS,_QUALIFIERS):
                _,count,can_close=task;limit=8 if kind==_UNITS else 6
                if b==93 and can_close:return State(self,rest)
                if b!=123 or count>=limit:return None
                after=_AFTER_UNITS if kind==_UNITS else _AFTER_QUALIFIERS
                child=_UNIT if kind==_UNITS else _QUALIFIER
                stack=rest+((after,count+1),(child,));continue
            if kind in (_AFTER_UNITS,_AFTER_QUALIFIERS):
                count=task[1];limit=8 if kind==_AFTER_UNITS else 6
                if b==93:return State(self,rest)
                if b!=44 or count>=limit:return None
                child=_UNITS if kind==_AFTER_UNITS else _QUALIFIERS
                return State(self,rest+((child,count,False),))
            if kind in (_UNIT,_QUALIFIER):
                sequence=self.unit if kind==_UNIT else self.qualifier
                stack=rest+tuple(reversed(sequence));continue
            raise AssertionError('unknown_analysis_shape_task')
        return None
