---
tags:
- sentence-transformers
- sentence-similarity
- feature-extraction
- dense
- generated_from_trainer
- dataset_size:10554
- loss:CosineSimilarityLoss
base_model: LazarusNLP/all-indo-e5-small-v4
widget:
- source_sentence: Menggunakan sunscreen setiap hari
  sentences:
  - Seorang anak laki-laki yang tampak sakit disentuh wajahnya oleh seorang balita.
  - 'Warga Hispanik secara resmi telah menyalip warga Amerika keturunan Afrika sebagai
    kelompok minoritas terbesar di AS

    menurut laporan yang dirilis oleh Biro Sensus AS.'
  - Tidak pernah menggunakan sunscreen
- source_sentence: Sering membeli makanan siap saji melalui aplikasi
  sentences:
  - Provinsi ini memiliki angka kepadatan penduduk 38 jiwa/km².
  - Kadang membeli makanan siap saji melalui aplikasi
  - Seorang pria sedang melakukan trik kartu.
- source_sentence: University of Michigan hari ini merilis kebijakan penerimaan mahasiswa
    baru setelah Mahkamah Agung AS membatalkan cara penerimaan mahasiswa baru yang
    sebelumnya.
  sentences:
  - '"Mereka telah memblokir semua tanaman bio baru karena ketakutan yang tidak berdasar
    dan tidak ilmiah," kata Bush.'
  - Jarang membeli kopi Kenangan
  - University of Michigan berencana untuk merilis kebijakan penerimaan mahasiswa
    baru pada hari Kamis setelah persyaratan penerimaannya ditolak oleh Mahkamah Agung
    AS pada bulan Juni.
- source_sentence: pakar non-proliferasi di institut internasional untuk studi strategis
    mark fitzpatrick menyatakan bahwa laporan IAEA - memiliki tenor yang sangat kuat.
  sentences:
  - Pernah membeli kopi Starbucks
  - rekan senior di institut internasional untuk studi strategis mark fitzpatrick
    menyatakan bahwa - rencana badan energi atom internasional adalah dangkal.
  - Korea Utara mengusulkan pembicaraan tingkat tinggi dengan AS
- source_sentence: Palestina dan Yordania koordinasikan sikap dalam perundingan damai
  sentences:
  - Petinggi Hamas bantah Gaza dan PA berkoordinasi dalam perundingan damai
  - Tidak pernah memesan makanan lewat aplikasi
  - Kereta api yang melaju di atas rel.
pipeline_tag: sentence-similarity
library_name: sentence-transformers
metrics:
- pearson_cosine
- spearman_cosine
model-index:
- name: SentenceTransformer based on LazarusNLP/all-indo-e5-small-v4
  results:
  - task:
      type: semantic-similarity
      name: Semantic Similarity
    dataset:
      name: sts indo detailed
      type: sts-indo-detailed
    metrics:
    - type: pearson_cosine
      value: 0.8612625897174441
      name: Pearson Cosine
    - type: spearman_cosine
      value: 0.8586969176298713
      name: Spearman Cosine
---

# SentenceTransformer based on LazarusNLP/all-indo-e5-small-v4

This is a [sentence-transformers](https://www.SBERT.net) model finetuned from [LazarusNLP/all-indo-e5-small-v4](https://huggingface.co/LazarusNLP/all-indo-e5-small-v4). It maps sentences & paragraphs to a 384-dimensional dense vector space and can be used for semantic textual similarity, semantic search, paraphrase mining, text classification, clustering, and more.

## Model Details

### Model Description
- **Model Type:** Sentence Transformer
- **Base model:** [LazarusNLP/all-indo-e5-small-v4](https://huggingface.co/LazarusNLP/all-indo-e5-small-v4) <!-- at revision 239ef03629c10bce80ea9e557255f249a542dece -->
- **Maximum Sequence Length:** 384 tokens
- **Output Dimensionality:** 384 dimensions
- **Similarity Function:** Cosine Similarity
<!-- - **Training Dataset:** Unknown -->
<!-- - **Language:** Unknown -->
<!-- - **License:** Unknown -->

### Model Sources

- **Documentation:** [Sentence Transformers Documentation](https://sbert.net)
- **Repository:** [Sentence Transformers on GitHub](https://github.com/UKPLab/sentence-transformers)
- **Hugging Face:** [Sentence Transformers on Hugging Face](https://huggingface.co/models?library=sentence-transformers)

### Full Model Architecture

```
SentenceTransformer(
  (0): Transformer({'max_seq_length': 384, 'do_lower_case': False, 'architecture': 'BertModel'})
  (1): Pooling({'word_embedding_dimension': 384, 'pooling_mode_cls_token': False, 'pooling_mode_mean_tokens': True, 'pooling_mode_max_tokens': False, 'pooling_mode_mean_sqrt_len_tokens': False, 'pooling_mode_weightedmean_tokens': False, 'pooling_mode_lasttoken': False, 'include_prompt': True})
)
```

## Usage

### Direct Usage (Sentence Transformers)

First install the Sentence Transformers library:

```bash
pip install -U sentence-transformers
```

Then you can load this model and run inference.
```python
from sentence_transformers import SentenceTransformer

# Download from the 🤗 Hub
model = SentenceTransformer("sentence_transformers_model_id")
# Run inference
sentences = [
    'Palestina dan Yordania koordinasikan sikap dalam perundingan damai',
    'Petinggi Hamas bantah Gaza dan PA berkoordinasi dalam perundingan damai',
    'Kereta api yang melaju di atas rel.',
]
embeddings = model.encode(sentences)
print(embeddings.shape)
# [3, 384]

# Get the similarity scores for the embeddings
similarities = model.similarity(embeddings, embeddings)
print(similarities)
# tensor([[ 1.0000,  0.5014, -0.0652],
#         [ 0.5014,  1.0000, -0.0518],
#         [-0.0652, -0.0518,  1.0000]])
```

<!--
### Direct Usage (Transformers)

<details><summary>Click to see the direct usage in Transformers</summary>

</details>
-->

<!--
### Downstream Usage (Sentence Transformers)

You can finetune this model on your own dataset.

<details><summary>Click to expand</summary>

</details>
-->

<!--
### Out-of-Scope Use

*List how the model may foreseeably be misused and address what users ought not to do with the model.*
-->

## Evaluation

### Metrics

#### Semantic Similarity

* Dataset: `sts-indo-detailed`
* Evaluated with <code>__main__.DetailedEmbeddingSimilarityEvaluator</code>

| Metric              | Value      |
|:--------------------|:-----------|
| pearson_cosine      | 0.8613     |
| **spearman_cosine** | **0.8587** |

<!--
## Bias, Risks and Limitations

*What are the known or foreseeable issues stemming from this model? You could also flag here known failure cases or weaknesses of the model.*
-->

<!--
### Recommendations

*What are recommendations with respect to the foreseeable issues? For example, filtering explicit content.*
-->

## Training Details

### Training Dataset

#### Unnamed Dataset

* Size: 10,554 training samples
* Columns: <code>sentence_0</code>, <code>sentence_1</code>, and <code>label</code>
* Approximate statistics based on the first 1000 samples:
  |         | sentence_0                                                                        | sentence_1                                                                        | label                                                          |
  |:--------|:----------------------------------------------------------------------------------|:----------------------------------------------------------------------------------|:---------------------------------------------------------------|
  | type    | string                                                                            | string                                                                            | float                                                          |
  | details | <ul><li>min: 5 tokens</li><li>mean: 14.45 tokens</li><li>max: 50 tokens</li></ul> | <ul><li>min: 5 tokens</li><li>mean: 14.19 tokens</li><li>max: 50 tokens</li></ul> | <ul><li>min: 0.0</li><li>mean: 0.47</li><li>max: 1.0</li></ul> |
* Samples:
  | sentence_0                                                         | sentence_1                                                                            | label                           |
  |:-------------------------------------------------------------------|:--------------------------------------------------------------------------------------|:--------------------------------|
  | <code>Tidak pernah mengisi saldo ShopeePay</code>                  | <code>Tidak pernah mengisi saldo GoPay</code>                                         | <code>0.0</code>                |
  | <code>PM Turki mendesak untuk mengakhiri protes di Istanbul</code> | <code>Polisi Turki menembakkan gas air mata ke arah pengunjuk rasa di Istanbul</code> | <code>0.56</code>               |
  | <code>Dua ekor kucing sedang melihat ke arah jendela.</code>       | <code>Seekor kucing putih yang sedang melihat ke luar jendela.</code>                 | <code>0.5199999809265137</code> |
* Loss: [<code>CosineSimilarityLoss</code>](https://sbert.net/docs/package_reference/sentence_transformer/losses.html#cosinesimilarityloss) with these parameters:
  ```json
  {
      "loss_fct": "torch.nn.modules.loss.MSELoss"
  }
  ```

### Training Hyperparameters
#### Non-Default Hyperparameters

- `eval_strategy`: steps
- `per_device_train_batch_size`: 6
- `per_device_eval_batch_size`: 6
- `num_train_epochs`: 7
- `multi_dataset_batch_sampler`: round_robin

#### All Hyperparameters
<details><summary>Click to expand</summary>

- `overwrite_output_dir`: False
- `do_predict`: False
- `eval_strategy`: steps
- `prediction_loss_only`: True
- `per_device_train_batch_size`: 6
- `per_device_eval_batch_size`: 6
- `per_gpu_train_batch_size`: None
- `per_gpu_eval_batch_size`: None
- `gradient_accumulation_steps`: 1
- `eval_accumulation_steps`: None
- `torch_empty_cache_steps`: None
- `learning_rate`: 5e-05
- `weight_decay`: 0.0
- `adam_beta1`: 0.9
- `adam_beta2`: 0.999
- `adam_epsilon`: 1e-08
- `max_grad_norm`: 1
- `num_train_epochs`: 7
- `max_steps`: -1
- `lr_scheduler_type`: linear
- `lr_scheduler_kwargs`: {}
- `warmup_ratio`: 0.0
- `warmup_steps`: 0
- `log_level`: passive
- `log_level_replica`: warning
- `log_on_each_node`: True
- `logging_nan_inf_filter`: True
- `save_safetensors`: True
- `save_on_each_node`: False
- `save_only_model`: False
- `restore_callback_states_from_checkpoint`: False
- `no_cuda`: False
- `use_cpu`: False
- `use_mps_device`: False
- `seed`: 42
- `data_seed`: None
- `jit_mode_eval`: False
- `use_ipex`: False
- `bf16`: False
- `fp16`: False
- `fp16_opt_level`: O1
- `half_precision_backend`: auto
- `bf16_full_eval`: False
- `fp16_full_eval`: False
- `tf32`: None
- `local_rank`: 0
- `ddp_backend`: None
- `tpu_num_cores`: None
- `tpu_metrics_debug`: False
- `debug`: []
- `dataloader_drop_last`: False
- `dataloader_num_workers`: 0
- `dataloader_prefetch_factor`: None
- `past_index`: -1
- `disable_tqdm`: False
- `remove_unused_columns`: True
- `label_names`: None
- `load_best_model_at_end`: False
- `ignore_data_skip`: False
- `fsdp`: []
- `fsdp_min_num_params`: 0
- `fsdp_config`: {'min_num_params': 0, 'xla': False, 'xla_fsdp_v2': False, 'xla_fsdp_grad_ckpt': False}
- `fsdp_transformer_layer_cls_to_wrap`: None
- `accelerator_config`: {'split_batches': False, 'dispatch_batches': None, 'even_batches': True, 'use_seedable_sampler': True, 'non_blocking': False, 'gradient_accumulation_kwargs': None}
- `parallelism_config`: None
- `deepspeed`: None
- `label_smoothing_factor`: 0.0
- `optim`: adamw_torch_fused
- `optim_args`: None
- `adafactor`: False
- `group_by_length`: False
- `length_column_name`: length
- `ddp_find_unused_parameters`: None
- `ddp_bucket_cap_mb`: None
- `ddp_broadcast_buffers`: False
- `dataloader_pin_memory`: True
- `dataloader_persistent_workers`: False
- `skip_memory_metrics`: True
- `use_legacy_prediction_loop`: False
- `push_to_hub`: False
- `resume_from_checkpoint`: None
- `hub_model_id`: None
- `hub_strategy`: every_save
- `hub_private_repo`: None
- `hub_always_push`: False
- `hub_revision`: None
- `gradient_checkpointing`: False
- `gradient_checkpointing_kwargs`: None
- `include_inputs_for_metrics`: False
- `include_for_metrics`: []
- `eval_do_concat_batches`: True
- `fp16_backend`: auto
- `push_to_hub_model_id`: None
- `push_to_hub_organization`: None
- `mp_parameters`: 
- `auto_find_batch_size`: False
- `full_determinism`: False
- `torchdynamo`: None
- `ray_scope`: last
- `ddp_timeout`: 1800
- `torch_compile`: False
- `torch_compile_backend`: None
- `torch_compile_mode`: None
- `include_tokens_per_second`: False
- `include_num_input_tokens_seen`: False
- `neftune_noise_alpha`: None
- `optim_target_modules`: None
- `batch_eval_metrics`: False
- `eval_on_start`: False
- `use_liger_kernel`: False
- `liger_kernel_config`: None
- `eval_use_gather_object`: False
- `average_tokens_across_devices`: False
- `prompts`: None
- `batch_sampler`: batch_sampler
- `multi_dataset_batch_sampler`: round_robin
- `router_mapping`: {}
- `learning_rate_mapping`: {}

</details>

### Training Logs
| Epoch  | Step | Training Loss | sts-indo-detailed_spearman_cosine |
|:------:|:----:|:-------------:|:---------------------------------:|
| 0.0569 | 100  | -             | 0.8225                            |
| 0.1137 | 200  | -             | 0.8261                            |
| 0.1706 | 300  | -             | 0.8263                            |
| 0.2274 | 400  | -             | 0.8259                            |
| 0.2843 | 500  | 0.0764        | 0.8273                            |
| 0.3411 | 600  | -             | 0.8305                            |
| 0.3980 | 700  | -             | 0.8319                            |
| 0.4548 | 800  | -             | 0.8341                            |
| 0.5117 | 900  | -             | 0.8345                            |
| 0.5685 | 1000 | 0.0445        | 0.8362                            |
| 0.6254 | 1100 | -             | 0.8384                            |
| 0.6822 | 1200 | -             | 0.8391                            |
| 0.7391 | 1300 | -             | 0.8464                            |
| 0.7959 | 1400 | -             | 0.8475                            |
| 0.8528 | 1500 | 0.0372        | 0.8471                            |
| 0.9096 | 1600 | -             | 0.8477                            |
| 0.9665 | 1700 | -             | 0.8458                            |
| 1.0    | 1759 | -             | 0.8464                            |
| 1.0233 | 1800 | -             | 0.8443                            |
| 1.0802 | 1900 | -             | 0.8455                            |
| 1.1370 | 2000 | 0.0316        | 0.8481                            |
| 1.1939 | 2100 | -             | 0.8447                            |
| 1.2507 | 2200 | -             | 0.8473                            |
| 1.3076 | 2300 | -             | 0.8474                            |
| 1.3644 | 2400 | -             | 0.8449                            |
| 1.4213 | 2500 | 0.0281        | 0.8515                            |
| 1.4781 | 2600 | -             | 0.8498                            |
| 1.5350 | 2700 | -             | 0.8506                            |
| 1.5918 | 2800 | -             | 0.8546                            |
| 1.6487 | 2900 | -             | 0.8534                            |
| 1.7055 | 3000 | 0.0271        | 0.8512                            |
| 1.7624 | 3100 | -             | 0.8493                            |
| 1.8192 | 3200 | -             | 0.8499                            |
| 1.8761 | 3300 | -             | 0.8523                            |
| 1.9329 | 3400 | -             | 0.8518                            |
| 1.9898 | 3500 | 0.0258        | 0.8529                            |
| 2.0    | 3518 | -             | 0.8535                            |
| 2.0466 | 3600 | -             | 0.8546                            |
| 2.1035 | 3700 | -             | 0.8526                            |
| 2.1603 | 3800 | -             | 0.8548                            |
| 2.2172 | 3900 | -             | 0.8504                            |
| 2.2740 | 4000 | 0.0222        | 0.8535                            |
| 2.3309 | 4100 | -             | 0.8533                            |
| 2.3877 | 4200 | -             | 0.8538                            |
| 2.4446 | 4300 | -             | 0.8518                            |
| 2.5014 | 4400 | -             | 0.8515                            |
| 2.5583 | 4500 | 0.021         | 0.8515                            |
| 2.6151 | 4600 | -             | 0.8529                            |
| 2.6720 | 4700 | -             | 0.8548                            |
| 2.7288 | 4800 | -             | 0.8552                            |
| 2.7857 | 4900 | -             | 0.8542                            |
| 2.8425 | 5000 | 0.0209        | 0.8571                            |
| 2.8994 | 5100 | -             | 0.8552                            |
| 2.9562 | 5200 | -             | 0.8553                            |
| 3.0    | 5277 | -             | 0.8552                            |
| 3.0131 | 5300 | -             | 0.8560                            |
| 3.0699 | 5400 | -             | 0.8531                            |
| 3.1268 | 5500 | 0.0199        | 0.8491                            |
| 3.1836 | 5600 | -             | 0.8515                            |
| 3.2405 | 5700 | -             | 0.8520                            |
| 3.2973 | 5800 | -             | 0.8547                            |
| 3.3542 | 5900 | -             | 0.8558                            |
| 3.4110 | 6000 | 0.0182        | 0.8560                            |
| 3.4679 | 6100 | -             | 0.8561                            |
| 3.5247 | 6200 | -             | 0.8562                            |
| 3.5816 | 6300 | -             | 0.8547                            |
| 3.6384 | 6400 | -             | 0.8547                            |
| 3.6953 | 6500 | 0.0171        | 0.8561                            |
| 3.7521 | 6600 | -             | 0.8563                            |
| 3.8090 | 6700 | -             | 0.8555                            |
| 3.8658 | 6800 | -             | 0.8562                            |
| 3.9227 | 6900 | -             | 0.8587                            |


### Framework Versions
- Python: 3.11.13
- Sentence Transformers: 5.1.0
- Transformers: 4.56.0
- PyTorch: 2.8.0
- Accelerate: 1.10.1
- Datasets: 4.0.0
- Tokenizers: 0.22.0

## Citation

### BibTeX

#### Sentence Transformers
```bibtex
@inproceedings{reimers-2019-sentence-bert,
    title = "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks",
    author = "Reimers, Nils and Gurevych, Iryna",
    booktitle = "Proceedings of the 2019 Conference on Empirical Methods in Natural Language Processing",
    month = "11",
    year = "2019",
    publisher = "Association for Computational Linguistics",
    url = "https://arxiv.org/abs/1908.10084",
}
```

<!--
## Glossary

*Clearly define terms in order to be accessible across audiences.*
-->

<!--
## Model Card Authors

*Lists the people who create the model card, providing recognition and accountability for the detailed work that goes into its construction.*
-->

<!--
## Model Card Contact

*Provides a way for people who have updates to the Model Card, suggestions, or questions, to contact the Model Card authors.*
-->