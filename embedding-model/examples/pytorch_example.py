#!/usr/bin/env python3
"""
PyTorch Usage Example - Indonesian Embedding Model
Demonstrates how to use the PyTorch version of the model
"""

import time
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

def load_model():
    """Load the Indonesian embedding model"""
    print("Loading Indonesian embedding model (PyTorch)...")
    model = SentenceTransformer('../pytorch')
    print(f"✅ Model loaded successfully!")
    return model

def basic_usage_example(model):
    """Basic usage example"""
    print("\n" + "="*60)
    print("📝 BASIC USAGE EXAMPLE")
    print("="*60)
    
    # Indonesian sentences for testing
    sentences = [
        "Teknologi artificial intelligence berkembang pesat",
        "AI dan machine learning sangat canggih",
        "Jakarta adalah ibu kota Indonesia",
        "Saya suka makan nasi goreng"
    ]
    
    print("Input sentences:")
    for i, sentence in enumerate(sentences, 1):
        print(f"  {i}. {sentence}")
    
    # Encode sentences
    print("\nEncoding sentences...")
    start_time = time.time()
    embeddings = model.encode(sentences, show_progress_bar=False)
    encoding_time = (time.time() - start_time) * 1000
    
    print(f"✅ Encoded {len(sentences)} sentences in {encoding_time:.1f}ms")
    print(f"📊 Embedding shape: {embeddings.shape}")
    print(f"📊 Embedding dimension: {embeddings.shape[1]}")

def similarity_example(model):
    """Semantic similarity example"""
    print("\n" + "="*60)
    print("🎯 SEMANTIC SIMILARITY EXAMPLE")
    print("="*60)
    
    # Test pairs with expected similarities
    test_pairs = [
        ("AI akan mengubah dunia teknologi", "Kecerdasan buatan akan mengubah dunia", "High"),
        ("Jakarta adalah ibu kota Indonesia", "Kota besar dengan banyak penduduk", "Medium"), 
        ("Mahasiswa belajar di universitas", "Siswa kuliah di kampus", "High"),
        ("Teknologi sangat canggih", "Kucing suka makan ikan", "Low")
    ]
    
    print("Testing semantic similarity on Indonesian text pairs:\n")
    
    for i, (text1, text2, expected) in enumerate(test_pairs, 1):
        # Encode both sentences
        embeddings = model.encode([text1, text2])
        
        # Calculate cosine similarity
        similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
        
        # Determine similarity category
        if similarity >= 0.7:
            category = "High"
            status = "🟢"
        elif similarity >= 0.3:
            category = "Medium" 
            status = "🟡"
        else:
            category = "Low"
            status = "🔴"
        
        # Check if prediction matches expectation
        correct = "✅" if category == expected else "❌"
        
        print(f"{correct} Pair {i} ({status} {category}): {similarity:.3f}")
        print(f"   Text 1: '{text1}'")
        print(f"   Text 2: '{text2}'")
        print(f"   Expected: {expected} | Predicted: {category}\n")

def clustering_example(model):
    """Text clustering example"""
    print("\n" + "="*60)
    print("🗂️ TEXT CLUSTERING EXAMPLE")
    print("="*60)
    
    # Indonesian sentences from different domains
    documents = [
        # Technology
        "Artificial intelligence mengubah cara kita bekerja",
        "Machine learning membantu prediksi data",
        "Software development membutuhkan keahlian programming",
        
        # Education  
        "Mahasiswa belajar di universitas negeri",
        "Pendidikan tinggi sangat penting untuk masa depan",
        "Dosen mengajar dengan metode yang inovatif",
        
        # Food
        "Nasi goreng adalah makanan favorit Indonesia",
        "Rendang merupakan masakan tradisional Sumatra",
        "Gado-gado menggunakan bumbu kacang yang lezat"
    ]
    
    print("Documents to cluster:")
    for i, doc in enumerate(documents, 1):
        print(f"  {i}. {doc}")
    
    # Encode documents
    print("\nEncoding documents...")
    embeddings = model.encode(documents, show_progress_bar=False)
    
    # Simple clustering using similarity
    from sklearn.cluster import KMeans
    
    # Cluster into 3 groups
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(embeddings)
    
    print(f"\n📊 Clustering results (3 clusters):")
    for cluster_id in range(3):
        docs_in_cluster = [documents[i] for i, c in enumerate(clusters) if c == cluster_id]
        print(f"\n🏷️ Cluster {cluster_id + 1}:")
        for doc in docs_in_cluster:
            print(f"   - {doc}")

def search_example(model):
    """Semantic search example"""
    print("\n" + "="*60)
    print("🔍 SEMANTIC SEARCH EXAMPLE") 
    print("="*60)
    
    # Document corpus
    corpus = [
        "Indonesia adalah negara kepulauan terbesar di dunia",
        "Jakarta merupakan ibu kota dan pusat bisnis Indonesia", 
        "Bali terkenal sebagai destinasi wisata yang indah",
        "Artificial intelligence mengubah industri teknologi",
        "Machine learning membantu analisis data besar",
        "Robotika masa depan akan sangat canggih",
        "Nasi padang adalah makanan khas Sumatra Barat",
        "Rendang dinobatkan sebagai makanan terlezat dunia",
        "Kuliner Indonesia sangat beragam dan kaya rasa"
    ]
    
    print("Document corpus:")
    for i, doc in enumerate(corpus, 1):
        print(f"  {i}. {doc}")
    
    # Encode corpus
    print("\nEncoding corpus...")
    corpus_embeddings = model.encode(corpus, show_progress_bar=False)
    
    # Search queries
    queries = [
        "teknologi AI dan machine learning",
        "makanan tradisional Indonesia", 
        "ibu kota Indonesia"
    ]
    
    for query in queries:
        print(f"\n🔍 Query: '{query}'")
        
        # Encode query
        query_embedding = model.encode([query])
        
        # Calculate similarities
        similarities = cosine_similarity(query_embedding, corpus_embeddings)[0]
        
        # Get top 3 results
        top_indices = np.argsort(similarities)[::-1][:3]
        
        print("📋 Top 3 most relevant documents:")
        for rank, idx in enumerate(top_indices, 1):
            print(f"  {rank}. (Score: {similarities[idx]:.3f}) {corpus[idx]}")

def performance_benchmark(model):
    """Performance benchmark"""
    print("\n" + "="*60)
    print("⚡ PERFORMANCE BENCHMARK")
    print("="*60)
    
    # Test different batch sizes
    test_sentences = [
        "Ini adalah kalimat percobaan untuk mengukur performa",
        "Teknologi artificial intelligence sangat membantu",
        "Indonesia memiliki budaya yang sangat beragam"
    ] * 10  # 30 sentences
    
    batch_sizes = [1, 5, 10, 30]
    
    print("Testing encoding performance with different batch sizes:\n")
    
    for batch_size in batch_sizes:
        sentences_batch = test_sentences[:batch_size]
        
        # Warm up
        model.encode(sentences_batch[:1], show_progress_bar=False)
        
        # Benchmark
        times = []
        for _ in range(3):  # 3 runs
            start_time = time.time()
            embeddings = model.encode(sentences_batch, show_progress_bar=False)
            end_time = time.time()
            times.append((end_time - start_time) * 1000)
        
        avg_time = np.mean(times)
        throughput = batch_size / (avg_time / 1000)
        
        print(f"📊 Batch size {batch_size:2d}: {avg_time:6.1f}ms | {throughput:5.1f} sentences/sec")

def main():
    """Main example function"""
    print("🚀 Indonesian Embedding Model - PyTorch Examples")
    print("This script demonstrates various use cases of the model\n")
    
    # Load model
    model = load_model()
    
    # Run examples
    basic_usage_example(model)
    similarity_example(model)
    clustering_example(model)
    search_example(model)
    performance_benchmark(model)
    
    print("\n" + "="*60)
    print("✅ ALL EXAMPLES COMPLETED SUCCESSFULLY!")
    print("="*60)
    print("💡 Tips:")
    print("   - Use ONNX version for production (7.8x faster)")
    print("   - Model works best with formal Indonesian text")
    print("   - Maximum input length: 384 tokens")
    print("   - For large batches, consider using GPU if available")

if __name__ == "__main__":
    main()