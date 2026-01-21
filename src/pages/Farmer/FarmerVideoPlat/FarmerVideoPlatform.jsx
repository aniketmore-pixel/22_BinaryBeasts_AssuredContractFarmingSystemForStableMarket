import { useEffect, useRef, useState } from "react";
import { Search, Mic } from "lucide-react";
import "./FarmerVideoPlatform.css";

/* ===================== VIDEO DATA ===================== */

const videos = [
    {
      id: 1,
      title: "Wheat Sowing Techniques (Hindi)",
      tags: "wheat sowing",
      description:
        "Explains modern wheat sowing methods including soil preparation, seed depth, row spacing and irrigation timing.",
      target:
        "Farmers who want to increase wheat yield using scientific techniques.",
      src: "https://www.youtube.com/embed/YXSjkZu-1Gg",
      platform: "youtube",
    },
    {
      id: 2,
      title: "Best Fertilizers for Wheat Crop",
      tags: "wheat fertilizer",
      description:
        "Detailed explanation of NPK fertilizers, dosage and correct stages for wheat growth.",
      target: "Helps farmers reduce fertilizer cost and improve crop health.",
      src: "https://www.youtube.com/embed/AVhkap1QItA",
      platform: "youtube",
    },
    {
      id: 3,
      title: "Organic Farming Basics (Hindi)",
      tags: "organic farming",
      description:
        "Introduction to organic farming including compost, vermicompost and bio-fertilizers.",
      target: "Farmers shifting from chemical to organic farming.",
      src: "https://www.youtube.com/embed/wougJaN_Ha0",
      platform: "youtube",
    },
    {
      id: 4,
      title: "Rice Transplantation Method",
      tags: "rice paddy sowing",
      description:
        "Shows correct rice nursery preparation and transplantation techniques.",
      target: "Paddy farmers aiming for uniform crop growth.",
      src: "https://www.youtube.com/embed/perGbcRc77o",
      platform: "youtube",
    },
    {
      id: 5,
      title: "Soil Testing Importance",
      tags: "soil testing",
      description:
        "Explains how soil testing helps determine fertilizer requirements.",
      target: "Farmers who want long-term soil fertility.",
      src: "https://www.youtube.com/embed/2XWp6hcyZP4",
      platform: "youtube",
    },
    {
      id: 6,
      title: "Drip Irrigation System",
      tags: "irrigation water",
      description:
        "Step-by-step explanation of drip irrigation benefits and installation.",
      target: "Farmers facing water scarcity.",
      src: "https://www.youtube.com/embed/Vof1GmL2DAQ",
      platform: "youtube",
    },
    {
      id: 7,
      title: "Pest Control in Vegetables",
      tags: "pest control vegetables",
      description:
        "Shows organic and chemical pest control methods for vegetables.",
      target: "Vegetable farmers preventing crop loss.",
      src: "https://www.youtube.com/embed/0US13rBCa5I",
      platform: "youtube",
    },
    {
      id: 8,
      title: "Compost Making at Home",
      tags: "compost organic",
      description: "Demonstrates how to prepare compost using farm waste.",
      target: "Low-cost organic input for farmers.",
      src: "https://www.youtube.com/embed/THBd-AId4os",
      platform: "youtube",
    },
    {
      id: 9,
      title: "Crop Rotation Benefits",
      tags: "crop rotation",
      description: "Explains why rotating crops improves soil nutrients.",
      target: "Farmers practicing sustainable agriculture.",
      src: "https://www.youtube.com/embed/KhwxhDY-mu0",
      platform: "youtube",
    },
    {
      id: 10,
      title: "Weed Control Techniques",
      tags: "weed control",
      description: "Mechanical and chemical weed control explained clearly.",
      target: "Farmers reducing yield loss from weeds.",
      src: "https://www.youtube.com/embed/fDpzv4wjT7o",
      platform: "youtube",
    },
    {
      id: 11,
      title: "Seed Treatment Methods",
      tags: "seed treatment",
      description: "How to treat seeds to prevent fungal and bacterial diseases.",
      target: "Farmers ensuring healthy crop germination.",
      src: "https://www.youtube.com/embed/9YnalQQr8wQ",
      platform: "youtube",
    },
    {
      id: 12,
      title: "Rainwater Harvesting for Farms",
      tags: "water management",
      description: "Shows simple rainwater harvesting techniques for farms.",
      target: "Farmers in low rainfall regions.",
      src: "https://www.youtube.com/embed/R0oj4UGKj68",
      platform: "youtube",
    },
    {
      id: 13,
      title: "Modern Farming Tools Overview",
      tags: "modern farming tools",
      description:
        "Overview of modern tools that reduce labor and increase productivity.",
      target: "Farmers upgrading to mechanized farming.",
      src: "https://www.youtube.com/embed/N-BpKLHSYE4",
      platform: "youtube",
    },
  ];
  

/* ===================== COMPONENT ===================== */

const FarmerVideoPlatform = () => {
    const [search, setSearch] = useState("");
    const [filteredVideos, setFilteredVideos] = useState(videos);
    const recognitionRef = useRef(null);

    /* ===== SEARCH FILTER ===== */
    useEffect(() => {
        const q = search.toLowerCase();
        setFilteredVideos(
            videos.filter(
                (v) =>
                    v.title.toLowerCase().includes(q) ||
                    v.tags.toLowerCase().includes(q) ||
                    v.description.toLowerCase().includes(q),
            ),
        );
    }, [search]);

    /* ===== AUDIO INPUT (WORKING) ===== */
    const startListening = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech recognition not supported in this browser");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "hi-IN"; // Hindi
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript;
            setSearch(spokenText);
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    return (
        <div className="video-platform">
            {/* Header */}
            <div className="platform-header">
                <h1>Farmer Learning Videos</h1>
                <p>Search or speak to find farming videos in Hindi</p>
            </div>

            {/* Search Bar */}
            <div className="search-bar">
                <Search size={18} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search or say: गेहूं खाद"
                />
                <button className="mic-btn" onClick={startListening}>
                    <Mic size={18} />
                </button>
            </div>

            {/* Videos */}
            <div className="video-grid">
                {filteredVideos.map((video) => (
                    <div key={video.id} className="video-card">
                        {video.platform === "youtube" ? (
                            <iframe
                                src={video.src}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video controls preload="metadata">
                                <source src={video.src} type="video/mp4" />
                            </video>
                        )}


                        <div className="video-info">
                            <h3>{video.title}</h3>
                            <span className="video-tags">{video.tags}</span>
                            <p className="description">{video.description}</p>
                            <p className="target">
                                <strong>Target:</strong> {video.target}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FarmerVideoPlatform;