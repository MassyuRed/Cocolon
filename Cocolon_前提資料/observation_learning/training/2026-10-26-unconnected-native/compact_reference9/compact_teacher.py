"""Lossless q/update spelling only; never rename native semantic identities."""
import copy

def rename(packet, quote_names, update_names):
    result=copy.deepcopy(packet)
    for item in result['q']:item['id']=quote_names[item['id']]
    def visit(value):
        if isinstance(value,list):return [visit(x) for x in value]
        if not isinstance(value,dict):return value
        result={}
        for key,item in value.items():
            if key=='ev':result[key]=[quote_names[x] for x in item]
            elif key=='ur':result[key]=[update_names[x] for x in item]
            elif key=='$id':result[key]=update_names[item]
            else:result[key]=visit(item)
        return result
    result['c']=visit(result['c'])
    return result

def compact(packet,codec):
    quote_names={x['id']:'q'+str(i) for i,x in enumerate(packet['q'])}
    update_names={x['$id']:'u'+str(i) for i,x in enumerate(packet['c']['updates'])}
    assert len(quote_names)==len(packet['q']) and len(update_names)==len(packet['c']['updates'])
    result=rename(packet,quote_names,update_names)
    assert codec.decode(result)==codec.decode(packet)
    assert rename(result,{v:k for k,v in quote_names.items()},{v:k for k,v in update_names.items()})==packet
    return result,dict(quote_names=quote_names,update_names=update_names)
