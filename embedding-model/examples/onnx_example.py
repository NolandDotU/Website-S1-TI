#!/usr/bin/env python3
"""
ONNX Runtime Usage Example - Indonesian Embedding Model
Demonstrates how to use the optimized ONNX version (7.8x faster)
"""

import time
import numpy as np
import onnxruntime as ort
from transformers import AutoTokenizer
from sklearn.metrics.pairwise import cosine_similarity

class IndonesianEmbeddingONNX:
    """Indonesian Embedding Model with ONNX Runtime"""
    
    def __init__(self, model_path="../onnx/indonesian_embedding_q8.onnx", 
                 tokenizer_path="../onnx"):
        """Initialize ONNX model and tokenizer"""
        print(f"Loading ONNX model: {model_path}")
        
        # Load ONNX model
        self.session = ort.InferenceSession(
            model_path, 
            providers=['CPUExecutionProvider']
        )
        
        # Load tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(tokenizer_path)
        
        # Get model info
        self.input_names = [input.name for input in self.session.get_inputs()]
        self.output_names = [output.name for output in self.session.get_outputs()]
        
        print(f"✅ Model loaded successfully!")
        print(f"📊 Input names: {self.input_names}")
        print(f"📊 Output names: {self.output_names}")
    
    def encode(self, sentences, max_length=384):
        """Encode sentences to embeddings"""
        if isinstance(sentences, str):
            sentences = [sentences]
        
        # Tokenize
        inputs = self.tokenizer(
            sentences,
            padding=True,
            truncation=True,
            max_length=max_length,
            return_tensors="np"
        )
        
        # Prepare ONNX inputs
        onnx_inputs = {
            'input_ids': inputs['input_ids'],
            'attention_mask': inputs['attention_mask']
        }
        
        # Add token_type_ids if required by model
        if 'token_type_ids' in self.input_names:
            if 'token_type_ids' in inputs:
                onnx_inputs['token_type_ids'] = inputs['token_type_ids']
            else:
                # Create zero token_type_ids
                onnx_inputs['token_type_ids'] = np.zeros_like(inputs['input_ids'])
        
        # Run inference
        outputs = self.session.run(None, onnx_inputs)
        
        # Get hidden states (first output)
        hidden_states = outputs[0]
        attention_mask = inputs['attention_mask']
        
        # Apply mean pooling with attention masking
        masked_embeddings = hidden_states * np.expand_dims(attention_mask, -1)
        summed = np.sum(masked_embeddings, axis=1)
        counts = np.sum(attention_mask, axis=1, keepdims=True)
        mean_pooled = summed / counts
        
        return mean_pooled

def basic_usage_example():
    """Basic ONNX usage example"""
    print("\n" + "="*60)
    print("📝 BASIC ONNX USAGE EXAMPLE")
    print("="*60)
    
    # Initialize model
    model = IndonesianEmbeddingONNX()
    
    # Test sentences
    sentences = [
        "Teknologi artificial intelligence berkembang pesat",
        "AI dan machine learning sangat canggih", 
        "Jakarta adalah ibu kota Indonesia",
        "Saya suka makan nasi goreng"
    ]
    
    print("\nInput sentences:")
    for i, sentence in enumerate(sentences, 1):
        print(f"  {i}. {sentence}")
    
    # Encode sentences
    print("\nEncoding with ONNX model...")
    start_time = time.time()
    embeddings = model.encode(sentences)
    encoding_time = (time.time() - start_time) * 1000
    
    print(f"✅ Encoded {len(sentences)} sentences in {encoding_time:.1f}ms")
    print(f"📊 Embedding shape: {embeddings.shape}")
    print(f"📊 Embedding dimension: {embeddings.shape[1]}")

def performance_comparison():
    """Compare ONNX vs PyTorch performance"""
    print("\n" + "="*60)
    print("⚡ PERFORMANCE COMPARISON")
    print("="*60)
    
    # Load ONNX model
    print("Loading ONNX quantized model...")
    onnx_model = IndonesianEmbeddingONNX()
    
    # Try to load PyTorch model for comparison
    try:
        from sentence_transformers import SentenceTransformer
        print("Loading PyTorch model...")
        pytorch_model = SentenceTransformer('../pytorch')
        pytorch_available = True
    except Exception as e:
        print(f"⚠️ PyTorch model not available: {e}")
        pytorch_available = False
    
    # Test sentences
    test_sentences = [
        "Artificial intelligence mengubah dunia teknologi",
        "Indonesia adalah negara kepulauan yang indah",
        "Mahasiswa belajar dengan tekun di universitas"
    ] * 5  # 15 sentences
    
    print(f"\nBenchmarking with {len(test_sentences)} sentences:\n")
    
    # Benchmark ONNX
    print("🔄 Testing ONNX quantized model...")
    onnx_times = []
    for _ in range(5):  # 5 runs
        start_time = time.time()
        onnx_embeddings = onnx_model.encode(test_sentences)
        end_time = time.time()
        onnx_times.append((end_time - start_time) * 1000)
    
    onnx_avg_time = np.mean(onnx_times)
    onnx_throughput = len(test_sentences) / (onnx_avg_time / 1000)
    
    print(f"📊 ONNX Average time: {onnx_avg_time:.1f}ms")
    print(f"📊 ONNX Throughput: {onnx_throughput:.1f} sentences/sec")
    
    # Benchmark PyTorch if available
    if pytorch_available:
        print("\n🔄 Testing PyTorch model...")
        pytorch_times = []
        for _ in range(5):  # 5 runs
            start_time = time.time()
            pytorch_embeddings = pytorch_model.encode(test_sentences, show_progress_bar=False)
            end_time = time.time()
            pytorch_times.append((end_time - start_time) * 1000)
        
        pytorch_avg_time = np.mean(pytorch_times)
        pytorch_throughput = len(test_sentences) / (pytorch_avg_time / 1000)
        
        print(f"📊 PyTorch Average time: {pytorch_avg_time:.1f}ms")
        print(f"📊 PyTorch Throughput: {pytorch_throughput:.1f} sentences/sec")
        
        # Calculate speedup
        speedup = pytorch_avg_time / onnx_avg_time
        print(f"\n🚀 ONNX is {speedup:.1f}x faster than PyTorch!")
        
        # Check accuracy retention
        print("\n🎯 Checking accuracy retention...")
        single_sentence = test_sentences[0]
        onnx_emb = onnx_model.encode([single_sentence])[0]
        pytorch_emb = pytorch_embeddings[0]
        
        # Calculate similarity between ONNX and PyTorch embeddings
        accuracy = cosine_similarity([onnx_emb], [pytorch_emb])[0][0]
        print(f"📊 Embedding similarity (ONNX vs PyTorch): {accuracy:.4f}")
        print(f"📊 Accuracy retention: {accuracy*100:.2f}%")

def similarity_showcase():
    """Showcase semantic similarity capabilities"""
    print("\n" + "="*60)
    print("🎯 SEMANTIC SIMILARITY SHOWCASE")
    print("="*60)
    
    model = IndonesianEmbeddingONNX()
    
    # High-quality test pairs
    test_cases = [
        {
            "pair": ("AI akan mengubah dunia teknologi", "Kecerdasan buatan akan mengubah dunia"),
            "expected": "High",
            "description": "Technology synonyms"
        },
        {
            "pair": ("Jakarta adalah ibu kota Indonesia", "Kota besar dengan banyak penduduk padat"),
            "expected": "Medium", 
            "description": "Geographical context"
        },
        {
            "pair": ("Mahasiswa belajar di universitas", "Siswa kuliah di kampus"),
            "expected": "High",
            "description": "Educational synonyms"
        },
        {
            "pair": ("Makanan Indonesia sangat lezat", "Kuliner nusantara memiliki cita rasa khas"),
            "expected": "High", 
            "description": "Food/cuisine context"
        },
        {
            "pair": ("Teknologi sangat canggih", "Kucing suka makan ikan"),
            "expected": "Low",
            "description": "Unrelated topics"
        }
    ]
    
    print("Testing semantic similarity with ONNX model:\n")
    
    correct_predictions = 0
    total_predictions = len(test_cases)
    
    for i, test_case in enumerate(test_cases, 1):
        text1, text2 = test_case["pair"]
        expected = test_case["expected"]
        description = test_case["description"]
        
        # Encode both sentences
        embeddings = model.encode([text1, text2])
        
        # Calculate similarity
        similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
        
        # Classify similarity
        if similarity >= 0.7:
            predicted = "High"
            status = "🟢"
        elif similarity >= 0.3:
            predicted = "Medium"
            status = "🟡"
        else:
            predicted = "Low"
            status = "🔴"
        
        # Check correctness
        correct = predicted == expected
        if correct:
            correct_predictions += 1
        
        result_icon = "✅" if correct else "❌"
        
        print(f"{result_icon} Test {i} - {description}")
        print(f"   Similarity: {similarity:.3f} {status}")
        print(f"   Expected: {expected} | Predicted: {predicted}")
        print(f"   Text 1: '{text1}'")
        print(f"   Text 2: '{text2}'\n")
    
    accuracy = (correct_predictions / total_predictions) * 100
    print(f"🎯 Overall Accuracy: {correct_predictions}/{total_predictions} ({accuracy:.1f}%)")

def production_deployment_example():
    """Production deployment example"""
    print("\n" + "="*60)
    print("🚀 PRODUCTION DEPLOYMENT EXAMPLE")
    print("="*60)
    
    # Simulate production scenario
    print("Simulating production API endpoint...")
    
    model = IndonesianEmbeddingONNX()
    
    # Simulate API requests
    api_requests = [
        "Bagaimana cara menggunakan artificial intelligence?",
        "Apa manfaat machine learning untuk bisnis?",
        "Dimana lokasi universitas terbaik di Jakarta?",
        "Makanan apa yang paling enak di Indonesia?",
        "Bagaimana cara belajar programming dengan efektif?"
    ]
    
    print(f"Processing {len(api_requests)} API requests...\n")
    
    total_start_time = time.time()
    
    for i, request in enumerate(api_requests, 1):
        # Simulate individual request processing
        start_time = time.time()
        embedding = model.encode([request])
        end_time = time.time()
        
        processing_time = (end_time - start_time) * 1000
        
        print(f"✅ Request {i}: {processing_time:.1f}ms")
        print(f"   Query: '{request}'")
        print(f"   Embedding shape: {embedding.shape}")
        print(f"   Response ready for similarity search/clustering\n")
    
    total_time = (time.time() - total_start_time) * 1000
    avg_time = total_time / len(api_requests)
    throughput = (len(api_requests) / total_time) * 1000
    
    print(f"📊 Production Performance Summary:")
    print(f"   Total time: {total_time:.1f}ms")
    print(f"   Average per request: {avg_time:.1f}ms")  
    print(f"   Throughput: {throughput:.1f} requests/second")
    print(f"   Ready for high-throughput production deployment! 🚀")

def main():
    """Main function"""
    print("🚀 Indonesian Embedding Model - ONNX Examples")
    print("Optimized version with 7.8x speedup and 75.7% size reduction\n")
    
    try:
        # Run examples
        basic_usage_example()
        performance_comparison()
        similarity_showcase()
        production_deployment_example()
        
        print("\n" + "="*60)
        print("✅ ALL ONNX EXAMPLES COMPLETED SUCCESSFULLY!")
        print("="*60)
        print("💡 Production Tips:")
        print("   - ONNX quantized version is 7.8x faster")
        print("   - 75.7% smaller file size (113MB vs 465MB)")
        print("   - >99% accuracy retention")
        print("   - Perfect for production deployment")
        print("   - Works on any CPU platform (Linux/Windows/macOS)")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Make sure ONNX files are available in ../onnx/ directory")

if __name__ == "__main__":
    main()