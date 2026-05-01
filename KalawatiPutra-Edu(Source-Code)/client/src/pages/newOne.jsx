import { useState, useEffect, useRef } from 'react';
import { register } from 'swiper/element/bundle';

// Register Swiper web components
register();

export default function TestimonialPage() {
    const swiperElRef = useRef(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Testimonial data
    const testimonials = [
        {
            avatar: 'S',
            name: 'Shivani Gupta',
            icon: '📱',
            text: '🎓 Day 30 Complete: My journey with Kalwatiputra Edu has been transformative! The AI-powered personalized learning has helped me grasp complex concepts that I struggled with for years. Forever grateful to @kalwatiputra_edu for their amazing methodology 🙏 https://t.co/edu445'
        },
        {
            avatar: 'A',
            name: 'Arjun Malhotra',
            icon: '🔗',
            text: 'Today, I completed my first month with the Kalwatiputra platform, and I\'m genuinely impressed with its innovative approach to learning. The platform features adaptive assessments and an AI tutor that actually understands where I\'m struggling! Best educational investment I\'ve made 💯'
        },
        {
            avatar: 'P',
            name: 'Priya Sharma',
            icon: '🔔',
            text: '🚀 Hello fellow learners! Today I had the opportunity to explore the Kalwatiputra Edu platform, and I\'m genuinely impressed with its interactive approach to learning. The gamified exercises make studying enjoyable rather than a chore. The community support is phenomenal too! ⭐⭐⭐⭐⭐'
        },
        {
            avatar: 'R',
            name: 'Rajat Verma',
            icon: '📊',
            text: 'My Kalwatiputra journey so far: 📈 Crossed the 75% mark and mastered concepts I never thought I could! (For competitive exams) Now it\'s time to focus on mock tests 🧠 All thanks to Dr. Kalwati Devi for her visionary approach 🙏 This platform is really well-structured, focused on outcomes!'
        },
         {
            avatar: 'R',
            name: 'Rajat Verma',
            icon: '📊',
            text: 'My Kalwatiputra journey so far: 📈 Crossed the 75% mark and mastered concepts I never thought I could! (For competitive exams) Now it\'s time to focus on mock tests 🧠 All thanks to Dr. Kalwati Devi for her visionary approach 🙏 This platform is really well-structured, focused on outcomes!'
        },
         {
            avatar: 'R',
            name: 'Rajat Verma',
            icon: '📊',
            text: 'My Kalwatiputra journey so far: 📈 Crossed the 75% mark and mastered concepts I never thought I could! (For competitive exams) Now it\'s time to focus on mock tests 🧠 All thanks to Dr. Kalwati Devi for her visionary approach 🙏 This platform is really well-structured, focused on outcomes!'
        }
    ];

    // Initialize Swiper on component mount
    useEffect(() => {
        // Make sure the DOM is fully loaded
        if (swiperElRef.current) {
            // Object with parameters
            const swiperParams = {
                slidesPerView: 1,
                spaceBetween: 20,
                centeredSlides: true,
                autoplay: {
                    delay: 0, // No delay for continuous movement
                    disableOnInteraction: false,
                },
                speed: 5000, // Very slow movement for subtle effect
                loop: true,
                effect: 'coverflow',
                coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                },
                on: {
                    init: function () {
                        setIsInitialized(true);
                    },
                },
            };

            // Assign parameters to swiper element
            Object.assign(swiperElRef.current, swiperParams);

            // Initialize swiper
            swiperElRef.current.initialize();
        }

        return () => {
            if (swiperElRef.current && swiperElRef.current.swiper) {
                swiperElRef.current.swiper.destroy();
            }
        };
    }, []);

    // Add the vertical floating animation for each card
    useEffect(() => {
        if (!isInitialized) return;

        const floatAnimation = () => {
            const slides = document.querySelectorAll('.swiper-slide');
            slides.forEach((slide, index) => {
                // Create alternating up and down animation
                const direction = index % 2 === 0 ? 1 : -1;
                const delay = index * 0.2;

                slide.style.transition = 'transform 2s ease-in-out';
                slide.style.transitionDelay = `${delay}s`;

                // Start animation in opposite direction
                slide.style.transform = `translateY(${direction * -15}px)`;

                // Toggle direction every 2 seconds
                setInterval(() => {
                    const currentTransform = slide.style.transform;
                    if (currentTransform.includes('-15px')) {
                        slide.style.transform = 'translateY(15px)';
                    } else {
                        slide.style.transform = 'translateY(-15px)';
                    }
                }, 2000);
            });
        };

        floatAnimation();
    }, [isInitialized]);

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-6xl mx-auto relative">
                {/* Header section */}
                <div className="text-center mb-20 relative">
                    <div className="absolute w-3 h-3 bg-gray-600 rounded-full left-1/2 transform -translate-x-1/2"></div>
                    <div className="absolute w-0.5 h-32 bg-gray-600 left-1/2 transform -translate-x-1/2 top-4"></div>
                    <h1 className="text-5xl font-bold mb-6">Where Learning Thrives</h1>
                    <div className="absolute bg-orange-500 text-white text-2xl font-bold py-4 px-8 rounded-lg left-1/2 transform -translate-x-1/2 -rotate-3 shadow-lg z-10 top-24">
                        What students say about us
                    </div>
                </div>

                {/* Testimonials with Swiper */}
                <swiper-container ref={swiperElRef} init="false" class="mySwiper">
                    {testimonials.map((testimonial, index) => (
                        <swiper-slide key={index} class="swiper-slide">
                            <div className="bg-gray-800 rounded-xl p-5 h-full transition-all duration-700 ease-in-out hover:shadow-md hover:shadow-orange-500/20">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-4 text-xl font-bold">
                                        {testimonial.avatar}
                                    </div>
                                    <div className="font-bold flex items-center">
                                        {testimonial.name}
                                        <span className="ml-2 opacity-70">{testimonial.icon}</span>
                                    </div>
                                </div>
                                <p className="leading-relaxed text-gray-200">
                                    {testimonial.text}
                                </p>
                            </div>
                        </swiper-slide>
                    ))}
                </swiper-container>
            </div>
        </div>
    );
}