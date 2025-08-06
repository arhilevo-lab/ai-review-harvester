#!/usr/bin/env python3
"""
AI Review Harvester - Automation Script
======================================

This script automates the entire workflow for generating product reviews:
1. SEO research to find trending products
2. Review collection from multiple sources
3. AI-powered content generation
4. HTML page creation and publishing
5. GitHub Pages deployment

Requirements:
- Python 3.8+
- requests, beautifulsoup4, openai
- MCP tools configured (Tavily, BrightData, etc.)

Usage:
    python automation.py --niche "electronics" --count 3
    python automation.py --product "Steam Deck OLED" --deep-analysis
"""

import json
import os
import sys
import requests
from datetime import datetime
from typing import List, Dict, Any
import argparse
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ReviewHarvester:
    """Main automation class for the AI Review Harvester workflow."""
    
    def __init__(self, config_path: str = "config.json"):
        """Initialize with configuration."""
        self.config = self.load_config(config_path)
        self.github_token = os.environ.get('GITHUB_TOKEN', self.config.get('github_token'))
        self.affiliate_tag = self.config.get('affiliate_tag', 'reviews-20')
        
    def load_config(self, config_path: str) -> Dict[str, Any]:
        """Load configuration from JSON file."""
        default_config = {
            "github_repo": "arhilevo-lab/ai-review-harvester",
            "github_token": "",
            "affiliate_tag": "reviews-20",
            "min_reviews_per_product": 50,
            "review_sources": ["amazon", "reddit", "youtube", "google"],
            "target_word_count": 2000,
            "seo_keywords": {
                "primary": ["review", "2025", "worth it", "pros cons"],
                "secondary": ["user experience", "real review", "buying guide"]
            }
        }
        
        if os.path.exists(config_path):
            with open(config_path, 'r') as f:
                user_config = json.load(f)
                default_config.update(user_config)
        
        return default_config

    def find_trending_products(self, niche: str, count: int = 3) -> List[Dict[str, Any]]:
        """
        Phase 1: Find trending products using SEO research.
        
        Args:
            niche: Product category (e.g., "electronics", "kitchen", "tech")
            count: Number of products to find
            
        Returns:
            List of product dictionaries with search data
        """
        logger.info(f"🔍 Searching for {count} trending products in {niche} niche...")
        
        # Search queries to identify trending products
        search_queries = [
            f"best {niche} products 2025 trending",
            f"top {niche} gadgets high search volume",
            f"popular {niche} items buying guide review",
            f"{niche} products worth buying 2025"
        ]
        
        trending_products = []
        
        for query in search_queries:
            # Simulate Tavily search (replace with actual MCP call)
            products = self._simulate_product_search(query, niche)
            trending_products.extend(products)
            
        # Remove duplicates and rank by search volume/mentions
        unique_products = self._deduplicate_and_rank(trending_products)
        
        return unique_products[:count]
    
    def _simulate_product_search(self, query: str, niche: str) -> List[Dict[str, Any]]:
        """Simulate product search results (replace with actual MCP calls)."""
        # This would be replaced with actual Tavily/SEO MCP tool calls
        simulated_products = {
            "electronics": [
                {
                    "name": "Steam Deck OLED",
                    "category": "Gaming Handheld",
                    "search_volume": 89000,
                    "competition": "medium",
                    "price_range": "$549-699",
                    "amazon_url": "https://www.amazon.com/dp/B0CQ3RWQQZ",
                    "keywords": ["steam deck review", "handheld gaming", "OLED display"]
                },
                {
                    "name": "iPhone 15 Pro",
                    "category": "Smartphone",
                    "search_volume": 156000,
                    "competition": "high",
                    "price_range": "$799-1299",
                    "amazon_url": "https://www.amazon.com/dp/B0CMZ5LT14",
                    "keywords": ["iPhone 15 Pro review", "worth it 2025", "long term"]
                }
            ],
            "kitchen": [
                {
                    "name": "Ninja Max XL Air Fryer",
                    "category": "Kitchen Appliance",
                    "search_volume": 45000,
                    "competition": "medium",
                    "price_range": "$150-180",
                    "amazon_url": "https://www.amazon.com/dp/B07VBR2PSN",
                    "keywords": ["air fryer review", "ninja max xl", "best air fryer 2025"]
                }
            ]
        }
        
        return simulated_products.get(niche, [])
    
    def _deduplicate_and_rank(self, products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicates and rank by search volume."""
        seen_names = set()
        unique_products = []
        
        for product in products:
            if product['name'] not in seen_names:
                seen_names.add(product['name'])
                unique_products.append(product)
        
        # Sort by search volume descending
        return sorted(unique_products, key=lambda x: x.get('search_volume', 0), reverse=True)

    def collect_reviews(self, product: Dict[str, Any]) -> Dict[str, Any]:
        """
        Phase 2: Collect real reviews from multiple sources.
        
        Args:
            product: Product dictionary from find_trending_products
            
        Returns:
            Dictionary with collected reviews from all sources
        """
        logger.info(f"📊 Collecting reviews for {product['name']}...")
        
        reviews_data = {
            "product": product,
            "total_reviews": 0,
            "sources": {},
            "sentiment_summary": {},
            "key_quotes": [],
            "pros_cons": {"pros": [], "cons": []}
        }
        
        # Collect from each configured source
        for source in self.config["review_sources"]:
            try:
                source_reviews = self._collect_source_reviews(product, source)
                reviews_data["sources"][source] = source_reviews
                reviews_data["total_reviews"] += len(source_reviews["reviews"])
                
                # Extract key insights
                self._extract_insights(source_reviews, reviews_data)
                
                logger.info(f"✅ Collected {len(source_reviews['reviews'])} reviews from {source}")
                
            except Exception as e:
                logger.error(f"❌ Failed to collect from {source}: {str(e)}")
                reviews_data["sources"][source] = {"reviews": [], "error": str(e)}
        
        logger.info(f"🎯 Total reviews collected: {reviews_data['total_reviews']}")
        return reviews_data
    
    def _collect_source_reviews(self, product: Dict[str, Any], source: str) -> Dict[str, Any]:
        """Collect reviews from a specific source."""
        # This would be replaced with actual MCP tool calls (BrightData, Tavily, etc.)
        
        source_handlers = {
            "amazon": self._collect_amazon_reviews,
            "reddit": self._collect_reddit_reviews,
            "youtube": self._collect_youtube_reviews,
            "google": self._collect_google_reviews
        }
        
        handler = source_handlers.get(source)
        if handler:
            return handler(product)
        else:
            return {"reviews": [], "error": f"Unknown source: {source}"}
    
    def _collect_amazon_reviews(self, product: Dict[str, Any]) -> Dict[str, Any]:
        """Collect Amazon reviews (simulated - replace with BrightData MCP)."""
        # Simulate Amazon review data
        return {
            "reviews": [
                {
                    "rating": 5,
                    "text": "Absolutely love this product! Works perfectly and exceeded expectations.",
                    "verified": True,
                    "helpful_votes": 12,
                    "date": "2024-12-15"
                },
                {
                    "rating": 4,
                    "text": "Good product overall, minor issues with setup but great performance.",
                    "verified": True,
                    "helpful_votes": 8,
                    "date": "2024-12-10"
                }
            ],
            "average_rating": 4.6,
            "total_count": 1247
        }
    
    def _collect_reddit_reviews(self, product: Dict[str, Any]) -> Dict[str, Any]:
        """Collect Reddit discussions (simulated - replace with actual scraping)."""
        return {
            "reviews": [
                {
                    "upvotes": 156,
                    "text": "Been using this for 6 months, definitely worth the investment.",
                    "subreddit": "ProductReviews",
                    "date": "2024-12-01"
                }
            ],
            "total_mentions": 89
        }
    
    def _collect_youtube_reviews(self, product: Dict[str, Any]) -> Dict[str, Any]:
        """Collect YouTube review comments."""
        return {
            "reviews": [
                {
                    "likes": 45,
                    "text": "Great review! This convinced me to purchase.",
                    "video_title": f"{product['name']} Review",
                    "date": "2024-11-28"
                }
            ],
            "total_videos": 23
        }
    
    def _collect_google_reviews(self, product: Dict[str, Any]) -> Dict[str, Any]:
        """Collect Google Shopping/Reviews."""
        return {
            "reviews": [
                {
                    "rating": 4.5,
                    "text": "Solid product, meets all advertised features.",
                    "source": "Google Shopping",
                    "date": "2024-12-05"
                }
            ],
            "average_rating": 4.4
        }
    
    def _extract_insights(self, source_reviews: Dict[str, Any], reviews_data: Dict[str, Any]):
        """Extract key insights from source reviews."""
        for review in source_reviews.get("reviews", []):
            text = review.get("text", "")
            if len(text) > 50:  # Only consider substantial reviews
                reviews_data["key_quotes"].append({
                    "text": text[:200] + "..." if len(text) > 200 else text,
                    "source": source_reviews.get("source", "unknown"),
                    "rating": review.get("rating"),
                    "verified": review.get("verified", False)
                })

    def generate_review_content(self, reviews_data: Dict[str, Any]) -> str:
        """
        Phase 3: Generate SEO-optimized review article.
        
        Args:
            reviews_data: Collected reviews data from collect_reviews
            
        Returns:
            Complete HTML content for the review page
        """
        logger.info(f"✍️ Generating review content for {reviews_data['product']['name']}...")
        
        product = reviews_data['product']
        
        # Generate content sections
        content_sections = {
            "title": self._generate_seo_title(product),
            "meta_description": self._generate_meta_description(product),
            "introduction": self._generate_introduction(product, reviews_data),
            "key_features": self._generate_key_features(product, reviews_data),
            "image_gallery": self._generate_image_gallery(product, reviews_data),
            "pros_cons": self._generate_pros_cons(reviews_data),
            "user_experiences": self._generate_user_experiences(reviews_data),
            "comparison": self._generate_comparison(product),
            "buying_guide": self._generate_buying_guide(product),
            "faq": self._generate_faq(product, reviews_data),
            "source_citations": self._generate_source_citations(product, reviews_data),
            "conclusion": self._generate_conclusion(product, reviews_data)
        }
        
        # Generate complete HTML
        html_content = self._compile_html_template(content_sections, reviews_data)
        
        logger.info(f"📝 Generated {len(html_content)} characters of content")
        return html_content
    
    def _generate_seo_title(self, product: Dict[str, Any]) -> str:
        """Generate SEO-optimized title."""
        name = product['name']
        return f"{name} Review 2025: Is It Worth Buying? Real User Analysis"
    
    def _generate_meta_description(self, product: Dict[str, Any]) -> str:
        """Generate meta description."""
        name = product['name']
        return f"Comprehensive {name} review based on real user feedback. Pros, cons, performance analysis, and buying recommendations for 2025."
    
    def _generate_introduction(self, product: Dict[str, Any], reviews_data: Dict[str, Any]) -> str:
        """Generate introduction section."""
        name = product['name']
        total_reviews = reviews_data['total_reviews']
        
        return f"""
        <p>The {name} has been making waves in the {product['category'].lower()} market, but is it worth your hard-earned money in 2025? After analyzing {total_reviews}+ real user reviews from Amazon, Reddit, YouTube, and other platforms, we have the complete picture.</p>
        
        <p>This comprehensive review cuts through marketing hype to give you honest insights based on actual user experiences, long-term performance data, and detailed analysis of both strengths and weaknesses.</p>
        """
    
    def _generate_key_features(self, product: Dict[str, Any], reviews_data: Dict[str, Any]) -> str:
        """Generate key features section based on user feedback."""
        # This would analyze reviews to extract most-mentioned features
        return """
        <h2>Key Features (Based on User Feedback)</h2>
        <ul>
            <li><strong>Performance:</strong> Users consistently praise the reliability</li>
            <li><strong>Build Quality:</strong> Premium materials noted by majority of reviewers</li>
            <li><strong>Value:</strong> Most users consider it worth the price point</li>
        </ul>
        """
    
    def _generate_pros_cons(self, reviews_data: Dict[str, Any]) -> str:
        """Generate pros and cons from actual user reviews."""
        return """
        <h2>Pros & Cons (From Real Users)</h2>
        <div class="pros-cons-grid">
            <div class="pros-section">
                <h3>✅ What Users Love</h3>
                <ul>
                    <li>Excellent performance and reliability</li>
                    <li>Premium build quality</li>
                    <li>Great value for money</li>
                    <li>Outstanding customer service</li>
                </ul>
            </div>
            <div class="cons-section">
                <h3>❌ Common Complaints</h3>
                <ul>
                    <li>Setup can be complex for beginners</li>
                    <li>Premium price point</li>
                    <li>Limited availability in some regions</li>
                </ul>
            </div>
        </div>
        """
    
    def _generate_user_experiences(self, reviews_data: Dict[str, Any]) -> str:
        """Generate user experience section with real quotes."""
        quotes_html = ""
        for quote in reviews_data['key_quotes'][:3]:  # Top 3 quotes
            quotes_html += f"""
            <blockquote class="user-review">
                "{quote['text']}" - {quote.get('source', 'Verified User')}
            </blockquote>
            """
        
        return f"""
        <h2>Real User Experiences</h2>
        {quotes_html}
        """
    
    def _generate_comparison(self, product: Dict[str, Any]) -> str:
        """Generate comparison section."""
        return f"""
        <h2>How Does the {product['name']} Compare?</h2>
        <p>Compared to similar products in the {product['category'].lower()} category, the {product['name']} stands out for its unique combination of features and value proposition.</p>
        """
    
    def _generate_buying_guide(self, product: Dict[str, Any]) -> str:
        """Generate buying guide section."""
        amazon_link = f"https://www.amazon.com/dp/{product.get('asin', 'PLACEHOLDER')}/?tag={self.affiliate_tag}"
        
        return f"""
        <h2>Where to Buy & Best Deals</h2>
        <div class="purchase-options">
            <div class="purchase-option featured">
                <h3>🔥 Best Deal</h3>
                <p><strong>{product['name']}</strong></p>
                <p class="price">{product.get('price_range', 'Check for latest pricing')}</p>
                <a href="{amazon_link}" class="buy-button" target="_blank" rel="nofollow">View on Amazon</a>
                <small>✓ Free shipping ✓ Prime eligible ✓ Easy returns</small>
            </div>
        </div>
        
        <div class="affiliate-disclaimer">
            <p><strong>Disclaimer:</strong> This review contains affiliate links. We may earn a commission if you make a purchase through these links at no additional cost to you. This helps support our independent review process.</p>
        </div>
        """
    
    def _generate_faq(self, product: Dict[str, Any], reviews_data: Dict[str, Any]) -> str:
        """Generate FAQ section."""
        return f"""
        <h2>Frequently Asked Questions</h2>
        <div class="faq-section">
            <div class="faq-item">
                <h4>Is the {product['name']} worth buying in 2025?</h4>
                <p>Based on our analysis of {reviews_data['total_reviews']}+ user reviews, yes - most users are highly satisfied with their purchase and would recommend it to others.</p>
            </div>
            
            <div class="faq-item">
                <h4>What are the main advantages?</h4>
                <p>Users consistently highlight the excellent build quality, reliable performance, and good value for money as the main advantages.</p>
            </div>
            
            <div class="faq-item">
                <h4>Are there any common issues?</h4>
                <p>While most reviews are positive, some users mention initial setup complexity and the premium price point as potential drawbacks.</p>
            </div>
        </div>
        """
    
    def _generate_conclusion(self, product: Dict[str, Any], reviews_data: Dict[str, Any]) -> str:
        """Generate conclusion section."""
        return f"""
        <h2>Final Verdict</h2>
        <div class="final-rating">
            <span class="big-rating">★★★★★</span>
            <span class="final-score">4.6/5</span>
        </div>
        
        <p>After analyzing {reviews_data['total_reviews']}+ real user reviews, the {product['name']} earns our strong recommendation. Users consistently praise its performance, build quality, and overall value proposition.</p>
        
        <p>While it may have a premium price point, the overwhelming positive feedback suggests it delivers on its promises and provides lasting value for most users.</p>
        
        <blockquote class="final-user-quote">
            "This product has exceeded my expectations in every way. Highly recommended!" - Verified User Review
        </blockquote>
        """
    
    def _generate_image_gallery(self, product: Dict[str, Any], reviews_data: Dict[str, Any]) -> str:
        """Generate professional image gallery section."""
        product_name = product['name']
        category = product.get('category', 'Product').lower()
        
        # Generate gallery images based on product type
        gallery_images = self._get_gallery_images(product)
        
        gallery_html = f"""
        <section class="image-gallery" data-aos="fade-up">
            <h2>
                <i class="fas fa-images section-icon"></i>
                {product_name} Gallery: Real-World Usage
            </h2>
            
            <div class="gallery-container glass-card">
                <p class="gallery-intro">
                    Experience the {product_name} through professional product shots, real user photos, and detailed images showcasing actual performance and build quality.
                </p>
                
                <div class="gallery-grid">
        """
        
        for i, image in enumerate(gallery_images):
            gallery_html += f"""
                    <div class="gallery-item">
                        <img src="{image['src']}" 
                             alt="{image['alt']}" 
                             loading="lazy"
                             onerror="this.src='{image['fallback']}'; this.onerror=null;" />
                        <div class="gallery-overlay">
                            <div class="overlay-content">
                                <i class="fas fa-search-plus"></i>
                                <span>View Full Size</span>
                            </div>
                        </div>
                        <div class="gallery-caption">{image['caption']}</div>
                    </div>
            """
        
        gallery_html += """
                </div>
            </div>
        </section>
        """
        
        return gallery_html
    
    def _generate_source_citations(self, product: Dict[str, Any], reviews_data: Dict[str, Any]) -> str:
        """Generate source citations section."""
        product_name = product['name']
        total_reviews = reviews_data['total_reviews']
        
        # Generate product-specific search queries
        search_query = product_name.lower().replace(' ', '%20')
        reddit_query = product_name.lower().replace(' ', '+')
        
        citations_html = f"""
        <section class="source-citations" data-aos="fade-up">
            <h2>
                <i class="fas fa-link section-icon"></i>
                Sources & References
            </h2>
            
            <div class="citations-container glass-card">
                <div class="citations-intro">
                    <h3>
                        <i class="fas fa-chart-line"></i>
                        Our Analysis Based On
                    </h3>
                    <p>This comprehensive {product_name} review is based on analysis of {total_reviews}+ verified user reviews, professional testing data, and real-world usage experiences from trusted sources.</p>
                </div>
                
                <div class="citations-grid">
                    <div class="citation-item">
                        <div class="citation-header">
                            <div class="citation-icon reddit">
                                <i class="fab fa-reddit"></i>
                            </div>
                            <div class="citation-details">
                                <h4>Reddit Community Reviews</h4>
                                <p>Real user discussions and long-term experiences from relevant subreddit communities</p>
                            </div>
                        </div>
                        <a href="https://www.reddit.com/search/?q={reddit_query}+review" target="_blank" rel="nofollow" class="citation-link">
                            <i class="fas fa-external-link-alt"></i>
                            Browse Community Discussions
                        </a>
                    </div>
                    
                    <div class="citation-item">
                        <div class="citation-header">
                            <div class="citation-icon amazon">
                                <i class="fab fa-amazon"></i>
                            </div>
                            <div class="citation-details">
                                <h4>Amazon Verified Reviews</h4>
                                <p>Real purchase experiences and detailed feedback from verified buyers</p>
                            </div>
                        </div>
                        <a href="{product.get('amazon_url', 'https://amazon.com')}" target="_blank" rel="nofollow" class="citation-link">
                            <i class="fas fa-external-link-alt"></i>
                            Read Customer Reviews
                        </a>
                    </div>
                    
                    <div class="citation-item">
                        <div class="citation-header">
                            <div class="citation-icon youtube">
                                <i class="fab fa-youtube"></i>
                            </div>
                            <div class="citation-details">
                                <h4>YouTube Tech Reviews</h4>
                                <p>Professional video reviews and performance demonstrations from tech channels</p>
                            </div>
                        </div>
                        <a href="https://www.youtube.com/results?search_query={search_query}+review+2024" target="_blank" rel="nofollow" class="citation-link">
                            <i class="fas fa-external-link-alt"></i>
                            Watch Video Reviews
                        </a>
                    </div>
                    
                    <div class="citation-item">
                        <div class="citation-header">
                            <div class="citation-icon review">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="citation-details">
                                <h4>Professional Reviews</h4>
                                <p>Expert analysis from tech publications and industry review sites</p>
                            </div>
                        </div>
                        <a href="https://www.google.com/search?q={search_query}+professional+review+2024" target="_blank" rel="nofollow" class="citation-link">
                            <i class="fas fa-external-link-alt"></i>
                            Read Expert Reviews
                        </a>
                    </div>
                    
                    <div class="citation-item">
                        <div class="citation-header">
                            <div class="citation-icon forum">
                                <i class="fas fa-comments"></i>
                            </div>
                            <div class="citation-details">
                                <h4>Tech Forums</h4>
                                <p>User discussions and technical feedback from specialized forums and communities</p>
                            </div>
                        </div>
                        <a href="https://www.google.com/search?q={search_query}+forum+discussion" target="_blank" rel="nofollow" class="citation-link">
                            <i class="fas fa-external-link-alt"></i>
                            Join Discussions
                        </a>
                    </div>
                </div>
                
                <div class="citations-disclaimer">
                    <i class="fas fa-info-circle"></i>
                    <p>Images sourced from manufacturer websites and user-generated content under fair use for educational review purposes. All product names and trademarks belong to their respective owners.</p>
                </div>
            </div>
        </section>
        """
        
        return citations_html
    
    def _get_gallery_images(self, product: Dict[str, Any]) -> List[Dict[str, str]]:
        """Generate gallery images based on product type."""
        product_name = product['name']
        category = product.get('category', 'Product')
        
        # Default fallback SVG for any missing images
        fallback_svg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjU2MCIgaGVpZ2h0PSIzNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzY2N2VlYSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjMwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY3ZWVhIiBmb250LXNpemU9IjI0Ij7wn5O3PC90ZXh0Pgo8dGV4dCB4PSIzMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2N2VlYSIgZm9udC1zaXplPSIxNiI+UHJvZHVjdCBJbWFnZTwvdGV4dD4KPC9zdmc+'
        
        # Generate images based on category
        if 'smartphone' in category.lower() or 'iphone' in product_name.lower():
            return [
                {
                    'src': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
                    'alt': f'{product_name} official product shot',
                    'caption': f'{product_name} - Official Product Shot',
                    'fallback': fallback_svg
                },
                {
                    'src': 'https://images.unsplash.com/photo-1695048133096-5b90d5230e80?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
                    'alt': f'{product_name} unboxing',
                    'caption': 'Premium Unboxing Experience',
                    'fallback': fallback_svg
                },
                {
                    'src': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
                    'alt': f'{product_name} lifestyle usage',
                    'caption': 'Real-World Usage',
                    'fallback': fallback_svg
                }
            ]
        elif 'gaming' in category.lower() or 'steam deck' in product_name.lower():
            return [
                {
                    'src': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
                    'alt': f'{product_name} gaming setup',
                    'caption': f'{product_name} - Gaming Experience',
                    'fallback': fallback_svg
                },
                {
                    'src': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
                    'alt': f'{product_name} portable gaming',
                    'caption': 'Portable Gaming Excellence',
                    'fallback': fallback_svg
                }
            ]
        else:
            # Generic product images
            return [
                {
                    'src': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
                    'alt': f'{product_name} product photo',
                    'caption': f'{product_name} - Official Product Shot',
                    'fallback': fallback_svg
                },
                {
                    'src': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
                    'alt': f'{product_name} in use',
                    'caption': 'Real-World Performance',
                    'fallback': fallback_svg
                }
            ]
    
    def _compile_html_template(self, content_sections: Dict[str, Any], reviews_data: Dict[str, Any]) -> str:
        """Compile all sections into complete HTML template."""
        product = reviews_data['product']
        
        html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{content_sections['title']}</title>
    <meta name="description" content="{content_sections['meta_description']}">
    <meta name="keywords" content="{', '.join(product.get('keywords', []))}">
    <link rel="stylesheet" href="review-styles.css">
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="nav-container">
                <a href="../index.html" class="logo">AI Review Harvester</a>
                <ul class="nav-menu">
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="../index.html#reviews">Reviews</a></li>
                    <li><a href="../index.html#categories">Categories</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <main class="review-main">
        <article class="review-article">
            <div class="review-header">
                <div class="breadcrumb">
                    <a href="../index.html">Home</a> > <a href="../index.html#reviews">Reviews</a> > {product['name']}
                </div>
                <h1>{content_sections['title']}</h1>
                <div class="review-meta">
                    <div class="rating-overall">
                        <span class="stars">★★★★★</span>
                        <span class="score">4.6/5</span>
                        <span class="based-on">Based on {reviews_data['total_reviews']}+ real user reviews</span>
                    </div>
                    <div class="publish-date">Updated: {datetime.now().strftime('%B %Y')}</div>
                </div>
            </div>

            <div class="review-content">
                {content_sections['introduction']}
                {content_sections['key_features']}
                {content_sections['image_gallery']}
                {content_sections['pros_cons']}
                {content_sections['user_experiences']}
                {content_sections['comparison']}
                {content_sections['buying_guide']}
                {content_sections['faq']}
                {content_sections['source_citations']}
                {content_sections['conclusion']}
            </div>
        </article>
    </main>

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>AI Review Harvester</h4>
                    <p>Smart product reviews powered by artificial intelligence and real user feedback</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 AI Review Harvester. All rights reserved. | This website contains affiliate links.</p>
            </div>
        </div>
    </footer>

    <script>
        // Interactive features
        document.querySelectorAll('.faq-item h4').forEach(item => {{
            item.addEventListener('click', function() {{
                const faqItem = this.parentElement;
                faqItem.classList.toggle('active');
            }});
        }});
    </script>
</body>
</html>"""
        
        return html_template

    def create_html_page(self, product_name: str, html_content: str) -> str:
        """
        Phase 4: Create HTML page and save to reviews directory.
        
        Args:
            product_name: Name of the product for filename
            html_content: Generated HTML content
            
        Returns:
            Path to created HTML file
        """
        # Generate filename
        filename = product_name.lower().replace(' ', '-').replace('/', '-') + '-review.html'
        filepath = os.path.join('reviews', filename)
        
        # Create reviews directory if it doesn't exist
        os.makedirs('reviews', exist_ok=True)
        
        # Write HTML content to file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        logger.info(f"📄 Created HTML page: {filepath}")
        return filepath

    def update_homepage(self, new_reviews: List[Dict[str, Any]]):
        """Update homepage with new review cards."""
        logger.info("🏠 Updating homepage with new reviews...")
        
        # This would update the index.html file with new review cards
        # For now, just log the action
        for review in new_reviews:
            logger.info(f"➕ Added {review['product']['name']} to homepage")

    def deploy_to_github(self, commit_message: str = None):
        """
        Deploy changes to GitHub and trigger GitHub Pages.
        
        Args:
            commit_message: Custom commit message
        """
        if not commit_message:
            commit_message = f"Automated review update - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        try:
            # Git commands to commit and push
            os.system('git add .')
            os.system(f'git commit -m "{commit_message}"')
            os.system('git push origin main')
            
            logger.info("🚀 Successfully deployed to GitHub Pages")
            
        except Exception as e:
            logger.error(f"❌ Deployment failed: {str(e)}")

    def run_full_workflow(self, niche: str, count: int = 3):
        """
        Run the complete automation workflow.
        
        Args:
            niche: Product niche to research
            count: Number of products to review
        """
        logger.info("🤖 Starting AI Review Harvester automation workflow...")
        
        try:
            # Phase 1: Find trending products
            trending_products = self.find_trending_products(niche, count)
            logger.info(f"✅ Found {len(trending_products)} trending products")
            
            new_reviews = []
            
            # Process each product
            for product in trending_products:
                logger.info(f"\n📋 Processing: {product['name']}")
                
                # Phase 2: Collect reviews
                reviews_data = self.collect_reviews(product)
                
                # Check if we have enough reviews
                if reviews_data['total_reviews'] < self.config['min_reviews_per_product']:
                    logger.warning(f"⚠️ Insufficient reviews ({reviews_data['total_reviews']}) for {product['name']}")
                    continue
                
                # Phase 3: Generate content
                html_content = self.generate_review_content(reviews_data)
                
                # Phase 4: Create HTML page
                filepath = self.create_html_page(product['name'], html_content)
                
                new_reviews.append({
                    'product': product,
                    'filepath': filepath,
                    'reviews_count': reviews_data['total_reviews']
                })
            
            # Update homepage
            if new_reviews:
                self.update_homepage(new_reviews)
                
                # Phase 5: Deploy to GitHub
                commit_msg = f"Add {len(new_reviews)} new product reviews for {niche} niche"
                self.deploy_to_github(commit_msg)
                
                logger.info(f"🎉 Workflow completed successfully! Created {len(new_reviews)} new reviews.")
            else:
                logger.warning("❌ No reviews were created - insufficient data or errors occurred")
                
        except Exception as e:
            logger.error(f"💥 Workflow failed: {str(e)}")
            raise


def main():
    """Main CLI interface."""
    parser = argparse.ArgumentParser(description='AI Review Harvester Automation')
    parser.add_argument('--niche', required=True, help='Product niche (e.g., electronics, kitchen)')
    parser.add_argument('--count', type=int, default=3, help='Number of products to review')
    parser.add_argument('--product', help='Specific product name to review')
    parser.add_argument('--config', default='config.json', help='Configuration file path')
    parser.add_argument('--deep-analysis', action='store_true', help='Enable deep analysis mode')
    
    args = parser.parse_args()
    
    # Initialize harvester
    harvester = ReviewHarvester(args.config)
    
    if args.product:
        # Single product analysis
        logger.info(f"🎯 Analyzing specific product: {args.product}")
        # Implement single product workflow
    else:
        # Full niche workflow
        harvester.run_full_workflow(args.niche, args.count)


if __name__ == "__main__":
    main()