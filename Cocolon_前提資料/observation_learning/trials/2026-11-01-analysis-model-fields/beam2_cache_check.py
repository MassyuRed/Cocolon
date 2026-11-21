"""CPU-only beam swap check for the installed Transformers 5.19.0 cache."""


def check_beam2_cache():
    from importlib.metadata import version
    import torch
    from transformers import AutoConfig
    from transformers.cache_utils import DynamicCache, DynamicLayer, LinearAttentionLayer

    assert version('transformers') == '5.19.0'
    assert not torch.cuda.is_initialized()
    config = AutoConfig.from_pretrained(
        'Qwen/Qwen3.5-4B',
        revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a',
        local_files_only=True, trust_remote_code=False)
    cache = DynamicCache(config=config)
    snapshots = []
    attention_count = linear_count = 0
    for index, layer in enumerate(cache.layers):
        # Tiny CPU states have distinct values in each beam and layer.
        if type(layer) is DynamicLayer:
            keys = torch.arange(8, dtype=torch.float32, device='cpu').reshape(2, 1, 2, 2) + index * 100
            values = keys + 20
            layer.update(keys, values)
            assert layer.is_initialized and layer.get_seq_length() == 2
            snapshots.append((layer, 'keys', None, layer.keys.clone()))
            snapshots.append((layer, 'values', None, layer.values.clone()))
            attention_count += 1
        elif type(layer) is LinearAttentionLayer:
            assert layer.number_of_states == 1
            conv = torch.arange(6, dtype=torch.float32, device='cpu').reshape(2, 1, 3) + index * 100
            recurrent = torch.arange(8, dtype=torch.float32, device='cpu').reshape(2, 1, 2, 2) + index * 100 + 20
            # The public updates perform lazy initialization and set the real
            # initialized flags/device; no flags are fabricated by this check.
            layer.update_conv_state(conv)
            layer.update_recurrent_state(recurrent)
            assert layer.is_conv_states_initialized[0]
            assert layer.is_recurrent_states_initialized[0]
            assert layer.device == torch.device('cpu')
            snapshots.append((layer, 'conv_states', 0, layer.conv_states[0].clone()))
            snapshots.append((layer, 'recurrent_states', 0, layer.recurrent_states[0].clone()))
            linear_count += 1
        else:
            raise AssertionError('unexpected_official_4b_cache_layer:' + type(layer).__name__)
    assert attention_count and linear_count
    beam_indices = torch.tensor([1, 0], dtype=torch.long, device='cpu')
    cache.reorder_cache(beam_indices)
    for layer, name, state_index, before in snapshots:
        after = getattr(layer, name)
        if state_index is not None:
            after = after[state_index]
        assert after.device.type == 'cpu'
        assert torch.equal(after, before.index_select(0, beam_indices)), name
    assert not torch.cuda.is_initialized()
    return dict(status='CPU_HYBRID_CACHE_BEAM_SWAP_PASSED',
                attention_layers=attention_count, linear_layers=linear_count,
                checked_state_tensors=len(snapshots), beam_indices=[1, 0],
                model_loads=0, model_forwards=0, training_updates=0)
