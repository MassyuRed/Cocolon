"""Full teacher CE with current-forward detached error weights, bounded in [1,16]."""

def require(ok, code):
    if not ok:
        raise ValueError(code)

def normalized_weights(ce):
    import torch
    require(ce.ndim == 1 and ce.numel() > 0, 'adaptive_ce_shape')
    require(torch.isfinite(ce).all().item() and (ce >= 0).all().item(), 'adaptive_ce_invalid')
    weights = 1.0 + 15.0 * (1.0 - torch.exp(-ce.detach())).square()
    return weights / weights.sum()

def loss_from_logits(logits, gold):
    import torch.nn.functional as F
    require(logits.ndim == 2 and gold.ndim == 1 and logits.shape[0] == gold.shape[0], 'adaptive_logits_shape')
    ce = F.cross_entropy(logits.float(), gold, reduction='none')
    return (normalized_weights(ce) * ce).sum()

def teacher_loss(model, helper, *, input_ids, attention_mask, labels, encoded, adaptive):
    if not adaptive:
        # Preserve the old9 path byte-for-byte at its existing owner.
        return helper.teacher_loss(model, input_ids=input_ids, attention_mask=attention_mask, labels=labels, encoded=encoded)
    start, count = helper.assistant_loss_window(encoded)
    out = model(input_ids=input_ids, attention_mask=attention_mask, logits_to_keep=count, use_cache=False)
    gold = labels[0, start + 1:]
    require(out.logits.shape[:2] == (1, count), 'adaptive_tail_logits_shape')
    return loss_from_logits(out.logits[0, :-1, :], gold)
