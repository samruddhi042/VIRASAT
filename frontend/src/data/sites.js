// src/data/sites.js
// Complete dataset of 42 UNESCO World Heritage Sites in India
// Used as local fallback when backend API is unavailable

export const SITES_DATA = [
  {
    id: 1, name: "Ajanta Caves", state: "Maharashtra", country: "India",
    category: "Cultural", year: 1983, emoji: "🏛️",
    description: "A series of 30 rock-cut Buddhist cave monuments dating from the 2nd century BCE to about 480 CE in the Sahyadri hills. The caves include paintings and rock-cut sculptures described as among the finest surviving examples of ancient Indian art, particularly Buddhist religious art.",
    keywords: ["cave", "Buddhist", "paintings", "ancient", "monastery"],
    entities: {
      locations: ["Aurangabad", "Maharashtra", "Sahyadri Hills"],
      historical: ["2nd century BCE", "Vakataka dynasty", "Gupta period", "480 CE"],
      keywords: ["vihara", "chaitya", "fresco", "cave monastery"],
      persons: ["Ashoka"]
    }
  },
  {
    id: 2, name: "Ellora Caves", state: "Maharashtra", country: "India",
    category: "Cultural", year: 1983, emoji: "⛩️",
    description: "Ellora is an archaeological site 29 km north-west of Aurangabad representing the epitome of Indian rock-cut architecture from 600–1000 CE. The 34 monasteries and temples—Buddhist, Hindu, and Jain—extend over more than 2 km, many with elaborate multi-storeyed facades.",
    keywords: ["cave", "Hindu", "Buddhist", "Jain", "Kailasa"],
    entities: {
      locations: ["Aurangabad", "Maharashtra", "Deccan plateau"],
      historical: ["Rashtrakuta dynasty", "600–1000 CE", "Chalukya period"],
      keywords: ["rock-cut", "Kailash temple", "monastery", "sculpture"],
      persons: ["Dantidurga"]
    }
  },
  {
    id: 3, name: "Agra Fort", state: "Uttar Pradesh", country: "India",
    category: "Cultural", year: 1983, emoji: "🏰",
    description: "The Agra Fort is a UNESCO World Heritage Site located in Agra. Built in red sandstone by Emperor Akbar beginning in 1565, it served as the main residence of the Mughal emperors until 1638, when the capital was shifted to Delhi.",
    keywords: ["fort", "Mughal", "red sandstone", "palace"],
    entities: {
      locations: ["Agra", "Uttar Pradesh", "Yamuna river"],
      historical: ["1565 CE", "Mughal Empire", "Akbar", "Shah Jahan"],
      keywords: ["fort", "rampart", "Diwan-i-Khas", "Jahangiri Mahal"],
      persons: ["Akbar", "Shah Jahan", "Aurangzeb"]
    }
  },
  {
    id: 4, name: "Taj Mahal", state: "Uttar Pradesh", country: "India",
    category: "Cultural", year: 1983, emoji: "🕌",
    description: "An immense mausoleum of white marble, built between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife, Mumtaz Mahal. It is considered the finest example of Mughal architecture, a blend of Indian, Persian, and Islamic styles.",
    keywords: ["mausoleum", "Mughal", "marble", "monument", "garden"],
    entities: {
      locations: ["Agra", "Uttar Pradesh", "Yamuna"],
      historical: ["1631–1648 CE", "Mughal Empire", "Shah Jahan"],
      keywords: ["mausoleum", "white marble", "charbagh", "minaret"],
      persons: ["Shah Jahan", "Mumtaz Mahal", "Ustad Ahmad Lahori"]
    }
  },
  {
    id: 5, name: "Konark Sun Temple", state: "Odisha", country: "India",
    category: "Cultural", year: 1984, emoji: "☀️",
    description: "The temple at Konark is a 13th century monument dedicated to the sun god Surya. Built by King Narasimhadeva I of the Eastern Ganga dynasty around 1250 CE, it represents the chariot of Surya with 12 pairs of elaborately carved wheels drawn by 7 horses.",
    keywords: ["temple", "sun", "Odisha", "medieval", "chariot"],
    entities: {
      locations: ["Puri district", "Odisha", "Bay of Bengal"],
      historical: ["1250 CE", "Eastern Ganga dynasty", "13th century"],
      keywords: ["sun temple", "chariot", "Surya", "stone carving"],
      persons: ["Narasimhadeva I"]
    }
  },
  {
    id: 6, name: "Kaziranga National Park", state: "Assam", country: "India",
    category: "Natural", year: 1985, emoji: "🦏",
    description: "Kaziranga National Park hosts two-thirds of the world's great one-horned rhinoceroses. The park is a vast expanse of tall elephant grass, marshland, and dense tropical moist broadleaf forests, and also has the highest density of tigers among protected areas in the world.",
    keywords: ["wildlife", "rhino", "tiger", "national park", "elephant"],
    entities: {
      locations: ["Assam", "Brahmaputra", "Golaghat", "Nagaon"],
      historical: ["1905 reserve", "1974 national park"],
      keywords: ["rhinoceros", "tiger", "elephant", "wetland"],
      persons: ["Mary Curzon"]
    }
  },
  {
    id: 7, name: "Manas Wildlife Sanctuary", state: "Assam", country: "India",
    category: "Natural", year: 1985, emoji: "🐅",
    description: "Located on the foothills of the Himalayas bordering Bhutan, Manas is a national park, UNESCO World Heritage Site, a Project Tiger Reserve, an elephant reserve, and a biosphere reserve. It is home to rare and endangered wildlife including the Assam roofed turtle and golden langur.",
    keywords: ["wildlife", "tiger", "sanctuary", "biodiversity", "Himalayan"],
    entities: {
      locations: ["Assam", "Bhutan border", "Himalayas", "Manas river"],
      historical: ["1928 reserve", "Project Tiger 1973"],
      keywords: ["tiger reserve", "biosphere", "golden langur", "pygmy hog"],
      persons: []
    }
  },
  {
    id: 8, name: "Keoladeo National Park", state: "Rajasthan", country: "India",
    category: "Natural", year: 1985, emoji: "🦅",
    description: "Formerly known as the Bharatpur Bird Sanctuary, Keoladeo is an important wintering area for migratory waterfowl from Afghanistan, Turkmenistan, China, and Siberia. At least 364 bird species have been recorded including the critically endangered Siberian crane.",
    keywords: ["birds", "wetland", "national park", "migratory", "sanctuary"],
    entities: {
      locations: ["Bharatpur", "Rajasthan", "Chambal"],
      historical: ["1956 bird sanctuary", "1982 national park"],
      keywords: ["bird sanctuary", "waterfowl", "Siberian crane", "wetland"],
      persons: []
    }
  },
  {
    id: 9, name: "Group of Monuments at Hampi", state: "Karnataka", country: "India",
    category: "Cultural", year: 1986, emoji: "🗿",
    description: "Hampi was the capital of the Vijayanagara Empire in the 14th century. The austere, grandiose site contains the ruins of a fortified city—temples, palaces, stables, market streets—spread across a dramatic landscape of boulders and the Tungabhadra river.",
    keywords: ["ruins", "Vijayanagara", "temple", "Karnataka", "fort"],
    entities: {
      locations: ["Karnataka", "Tungabhadra river", "Bellary", "Hosapete"],
      historical: ["Vijayanagara Empire", "14th–16th century", "1565 defeat"],
      keywords: ["Virupaksha temple", "stone chariot", "market", "gopura"],
      persons: ["Krishnadevaraya", "Harihara", "Bukka"]
    }
  },
  {
    id: 10, name: "Fatehpur Sikri", state: "Uttar Pradesh", country: "India",
    category: "Cultural", year: 1986, emoji: "🕌",
    description: "Built during the second half of the 16th century by Emperor Akbar, Fatehpur Sikri served as capital of the Mughal Empire for about 14 years. The ensemble of palaces, public buildings, and mosque represents an outstanding example of Mughal architecture blending Hindu, Islamic, and Persian traditions.",
    keywords: ["Mughal", "palace", "mosque", "Akbar", "capital"],
    entities: {
      locations: ["Agra district", "Uttar Pradesh"],
      historical: ["Akbar", "1569–1585 CE", "Mughal capital"],
      keywords: ["Jama Masjid", "Buland Darwaza", "Panch Mahal", "palace"],
      persons: ["Akbar", "Salim Chishti"]
    }
  },
  {
    id: 11, name: "Group of Monuments at Pattadakal", state: "Karnataka", country: "India",
    category: "Cultural", year: 1987, emoji: "⛩️",
    description: "Pattadakal, in Karnataka, represents the peak of an eclectic art which in the 7th and 8th century achieved a harmonious blend of architectural forms from northern and southern India. The complex of nine Hindu temples and a Jain sanctuary showcases the Chalukya style.",
    keywords: ["temple", "Karnataka", "Chalukya", "medieval", "Dravidian"],
    entities: {
      locations: ["Bagalkot", "Karnataka", "Malaprabha river"],
      historical: ["Chalukya dynasty", "7th–8th century CE"],
      keywords: ["Virupaksha temple", "Nagara", "Dravidian", "Chalukya"],
      persons: ["Vikramaditya II"]
    }
  },
  {
    id: 12, name: "Elephanta Caves", state: "Maharashtra", country: "India",
    category: "Cultural", year: 1987, emoji: "🐘",
    description: "The 'City of Caves' on Elephanta Island in Mumbai Harbour is a collection of rock art linked to the cult of Shiva. The caves, believed to have been constructed between the 5th and 8th centuries CE, contain a series of large-scale stone sculptures depicting Shaivite narratives.",
    keywords: ["caves", "Shiva", "sculpture", "island", "rock-cut"],
    entities: {
      locations: ["Mumbai", "Maharashtra", "Arabian Sea", "Elephanta Island"],
      historical: ["5th–8th century CE", "Rashtrakuta"],
      keywords: ["Trimurti", "Shiva", "rock-cut", "Maheshamurti"],
      persons: []
    }
  },
  {
    id: 13, name: "Great Living Chola Temples", state: "Tamil Nadu", country: "India",
    category: "Cultural", year: 1987, emoji: "🛕",
    description: "The Great Living Chola Temples were built by the kings of the Chola Empire from the 9th to 12th century CE. The group includes the Brihadisvara Temple at Thanjavur, the temple of Gangaikondacholapuram, and the Airavatesvara Temple at Darasuram—all still active places of worship.",
    keywords: ["temple", "Chola", "Tamil Nadu", "Dravidian", "gopuram"],
    entities: {
      locations: ["Thanjavur", "Tamil Nadu", "Kaveri river"],
      historical: ["Chola Empire", "9th–12th century", "Raja Raja Chola I"],
      keywords: ["Brihadisvara", "Dravidian", "gopuram", "vimana"],
      persons: ["Raja Raja Chola I", "Rajendra Chola"]
    }
  },
  {
    id: 14, name: "Group of Monuments at Mahabalipuram", state: "Tamil Nadu", country: "India",
    category: "Cultural", year: 1984, emoji: "🌊",
    description: "This group of sanctuaries and monuments, founded by the Pallava kings, was carved out of rock along the Coromandel Coast in the 7th and 8th centuries. It is famous for its rathas (chariots), mandapas (cave sanctuaries), giant open-air bas-reliefs, and the Shore Temple.",
    keywords: ["Pallava", "monument", "Tamil Nadu", "coastal", "shore temple"],
    entities: {
      locations: ["Kanchipuram district", "Tamil Nadu", "Bay of Bengal", "Coromandel Coast"],
      historical: ["Pallava dynasty", "7th–8th century CE", "Narasimhavarman I"],
      keywords: ["rathas", "Shore Temple", "bas-relief", "mandapa"],
      persons: ["Narasimhavarman I", "Mahendravarman"]
    }
  },
  {
    id: 15, name: "Nanda Devi and Valley of Flowers", state: "Uttarakhand", country: "India",
    category: "Natural", year: 1988, emoji: "🌸",
    description: "Nanda Devi National Park encompasses a mountainous wilderness with impressive glaciers, alpine meadows, and diverse fauna in the Western Himalayas. The Valley of Flowers is renowned for its rich diversity of alpine flora, covering 87.5 sq km of undisturbed natural beauty.",
    keywords: ["national park", "Himalayas", "flowers", "wildlife", "glacier"],
    entities: {
      locations: ["Uttarakhand", "Himalayas", "Chamoli", "Zanskar range"],
      historical: ["1982 biosphere reserve", "1988 UNESCO"],
      keywords: ["alpine flora", "snow leopard", "Himalayan fauna", "Brahma Kamal"],
      persons: []
    }
  },
  {
    id: 16, name: "Buddhist Monuments at Sanchi", state: "Madhya Pradesh", country: "India",
    category: "Cultural", year: 1989, emoji: "☸️",
    description: "The monuments of Sanchi represent the finest and most extensive examples of early Buddhist art and architecture in India. The stupas, monasteries, temples, and pillars date from the 3rd century BCE to the 12th century CE, forming a unique testimony to Buddhist art development.",
    keywords: ["Buddhist", "stupa", "Sanchi", "ancient", "Ashoka"],
    entities: {
      locations: ["Raisen", "Madhya Pradesh", "Vidisha"],
      historical: ["Ashoka", "3rd century BCE", "Gupta period", "Sunga dynasty"],
      keywords: ["stupa", "torana", "Ashoka pillar", "Great Stupa"],
      persons: ["Ashoka", "Devi"]
    }
  },
  {
    id: 17, name: "Humayun's Tomb", state: "Delhi", country: "India",
    category: "Cultural", year: 1993, emoji: "🕌",
    description: "Built in 1570, Humayun's Tomb was the first garden-tomb on the Indian subcontinent. Commissioned by Humayun's widow Hamida Banu Begum and designed by Persian architect Mirak Mirza Ghiyas, it inspired several major architectural innovations, culminating in the Taj Mahal.",
    keywords: ["Mughal", "tomb", "garden", "Delhi", "Persian"],
    entities: {
      locations: ["Delhi", "Nizamuddin"],
      historical: ["1570 CE", "Mughal Empire", "Humayun"],
      keywords: ["charbagh", "double dome", "sandstone", "marble inlay"],
      persons: ["Humayun", "Hamida Banu Begum", "Mirak Mirza Ghiyas"]
    }
  },
  {
    id: 18, name: "Qutb Minar and its Monuments", state: "Delhi", country: "India",
    category: "Cultural", year: 1993, emoji: "🗼",
    description: "The Qutb Minar is a 72.5-metre minaret and victory tower built in 1193 CE. The complex also includes the Quwwat-ul-Islam Mosque (the first mosque in India), an Iron Pillar dating from the 4th century CE, and the tomb of Iltutmish.",
    keywords: ["minaret", "Delhi", "medieval", "Islamic", "mosque"],
    entities: {
      locations: ["Delhi", "Mehrauli"],
      historical: ["1193 CE", "Delhi Sultanate", "Qutb-ud-din Aibak", "Iltutmish"],
      keywords: ["minaret", "Quwwat-ul-Islam", "iron pillar", "Mamluk dynasty"],
      persons: ["Qutb-ud-din Aibak", "Iltutmish"]
    }
  },
  {
    id: 19, name: "Mountain Railways of India", state: "Multiple", country: "India",
    category: "Cultural", year: 1999, emoji: "🚂",
    description: "This serial World Heritage property comprises three mountain railways: the Darjeeling Himalayan Railway (1881), the Nilgiri Mountain Railway (1908), and the Kalka–Shimla Railway (2008). They represent bold engineering achievements in mountainous terrain during the British colonial era.",
    keywords: ["railway", "heritage", "engineering", "colonial", "steam"],
    entities: {
      locations: ["Darjeeling", "West Bengal", "Nilgiris", "Tamil Nadu", "Shimla"],
      historical: ["British colonial era", "1881 Darjeeling Railway", "1908 Nilgiri Railway"],
      keywords: ["mountain railway", "steam locomotive", "narrow gauge", "UNESCO"],
      persons: []
    }
  },
  {
    id: 20, name: "Mahabodhi Temple Complex", state: "Bihar", country: "India",
    category: "Cultural", year: 2002, emoji: "🪷",
    description: "The Mahabodhi Temple Complex at Bodh Gaya is one of the four holy sites related to the life of Lord Buddha. The present temple, built in the 5th–6th centuries CE, marks the site of the Bodhi Tree under which Prince Siddhartha attained Enlightenment around 531 BCE.",
    keywords: ["Buddhist", "temple", "Bihar", "enlightenment", "Bodhi tree"],
    entities: {
      locations: ["Bodh Gaya", "Bihar", "Niranjana river"],
      historical: ["531 BCE enlightenment", "Emperor Ashoka", "5th–6th century CE temple"],
      keywords: ["Bodhi tree", "Buddha", "enlightenment", "stupa"],
      persons: ["Siddhartha Gautama", "Emperor Ashoka"]
    }
  },
  {
    id: 21, name: "Rock Shelters of Bhimbetka", state: "Madhya Pradesh", country: "India",
    category: "Cultural", year: 2003, emoji: "🪨",
    description: "The Rock Shelters of Bhimbetka at the foothills of the Vindhyan Mountains contain the earliest traces of human life on the Indian subcontinent. The paintings spanning over 30 rock shelters represent more than 100,000 years of continuous human occupation.",
    keywords: ["prehistoric", "rock art", "cave", "ancient", "Paleolithic"],
    entities: {
      locations: ["Raisen", "Madhya Pradesh", "Vindhya hills"],
      historical: ["100,000 BCE", "Stone Age", "Mesolithic", "Paleolithic"],
      keywords: ["rock shelter", "cave painting", "prehistoric art", "petroglyph"],
      persons: []
    }
  },
  {
    id: 22, name: "Champaner-Pavagadh Archaeological Park", state: "Gujarat", country: "India",
    category: "Cultural", year: 2004, emoji: "🏯",
    description: "A concentration of largely unexcavated archaeological and historic heritage properties on Pavagadh hill and in the planned medieval city of Champaner. The site contains prehistoric settlements alongside 8th–14th century Rajput and 15th–16th century Sultanate-era architecture.",
    keywords: ["archaeological", "Gujarat", "hill fort", "Islamic", "stepwell"],
    entities: {
      locations: ["Panchmahal", "Gujarat", "Pavagadh hill"],
      historical: ["Chavda dynasty", "10th century", "Mahmud Begada", "15th century"],
      keywords: ["fort", "Jama Masjid", "step well", "medieval city"],
      persons: ["Mahmud Begada"]
    }
  },
  {
    id: 23, name: "Chhatrapati Shivaji Maharaj Terminus", state: "Maharashtra", country: "India",
    category: "Cultural", year: 2004, emoji: "🚉",
    description: "Formerly known as Victoria Terminus, this is an outstanding example of Victorian Gothic Revival architecture in India, blending Italian Gothic elements with traditional Indian architecture. Designed by Frederick William Stevens and completed in 1888.",
    keywords: ["railway", "Gothic", "Mumbai", "colonial", "Victorian"],
    entities: {
      locations: ["Mumbai", "Maharashtra"],
      historical: ["1888 CE", "Victorian era", "British Raj"],
      keywords: ["Gothic Revival", "Victorian", "railway terminus", "turrets"],
      persons: ["Frederick William Stevens"]
    }
  },
  {
    id: 24, name: "Red Fort Complex", state: "Delhi", country: "India",
    category: "Cultural", year: 2007, emoji: "🏰",
    description: "Built as the palace fort of Shahjahanabad, the fifth Mughal Emperor Shah Jahan's new capital, the Red Fort represents the zenith of Mughal creativity. Construction began in 1638 and was completed in 1648. The fort has an octagonal plan built in red sandstone.",
    keywords: ["fort", "Mughal", "Delhi", "Shah Jahan", "palace"],
    entities: {
      locations: ["Delhi", "Yamuna river", "Chandni Chowk"],
      historical: ["1638–1648 CE", "Shah Jahan", "Mughal Empire", "Shahjahanabad"],
      keywords: ["Lahori Gate", "Diwan-i-Aam", "Rang Mahal", "Mughal"],
      persons: ["Shah Jahan", "Aurangzeb"]
    }
  },
  {
    id: 25, name: "The Jantar Mantar, Jaipur", state: "Rajasthan", country: "India",
    category: "Cultural", year: 2010, emoji: "🔭",
    description: "The Jantar Mantar in Jaipur is a collection of nineteen architectural astronomical instruments built between 1727 and 1734 by Maharaja Sawai Jai Singh II. The largest instrument, the Samrat Yantra, is a 27-metre-high gnomon whose shadow allows time to be read to an accuracy of two seconds.",
    keywords: ["observatory", "astronomy", "Jaipur", "Rajasthan", "masonry"],
    entities: {
      locations: ["Jaipur", "Rajasthan"],
      historical: ["1727–1734 CE", "Maharaja Sawai Jai Singh II", "18th century"],
      keywords: ["observatory", "Samrat Yantra", "sundial", "gnomon"],
      persons: ["Sawai Jai Singh II"]
    }
  },
  {
    id: 26, name: "Western Ghats", state: "Multiple", country: "India",
    category: "Natural", year: 2012, emoji: "🌿",
    description: "The Western Ghats, older than the Himalayas, represent one of the world's eight biodiversity hotspots. The site comprises 39 properties across four states (Tamil Nadu, Kerala, Karnataka, Maharashtra). The forests of the Western Ghats influence the Indian monsoon weather patterns.",
    keywords: ["biodiversity", "Ghats", "forest", "wildlife", "monsoon"],
    entities: {
      locations: ["Kerala", "Tamil Nadu", "Karnataka", "Maharashtra", "Nilgiris"],
      historical: ["Precambrian mountains", "biodiversity hotspot 2007"],
      keywords: ["biodiversity", "rainforest", "endemic species", "lion-tailed macaque"],
      persons: []
    }
  },
  {
    id: 27, name: "Hill Forts of Rajasthan", state: "Rajasthan", country: "India",
    category: "Cultural", year: 2013, emoji: "🏯",
    description: "This serial nomination of six majestic forts — Chittorgarh, Kumbhalgarh, Sawai Madhopur (Ranthambore), Jhalawar (Gagron), Jaipur (Amber), and Jaisalmer — illustrates the importance of Rajput values through these monumental works. The forts reflect extensive use of natural defensive advantages.",
    keywords: ["fort", "Rajasthan", "Rajput", "medieval", "palace"],
    entities: {
      locations: ["Rajasthan", "Chittorgarh", "Jaipur", "Jaisalmer", "Kumbhalgarh"],
      historical: ["Rajput kingdoms", "8th–18th century CE", "Mewar", "Marwar"],
      keywords: ["Rajput fort", "palace", "water harvesting", "zenana"],
      persons: ["Maharana Pratap", "Rana Kumbha"]
    }
  },
  {
    id: 28, name: "Rani-ki-Vav", state: "Gujarat", country: "India",
    category: "Cultural", year: 2014, emoji: "💧",
    description: "Rani-ki-Vav (the Queen's Stepwell) at Patan was built in the 11th century CE on the banks of the Saraswati River as a memorial to King Bhimdev I. It is considered the finest example of stepwell architecture in India, adorned with over 500 principal sculptures.",
    keywords: ["stepwell", "Gujarat", "water", "Solanki", "architecture"],
    entities: {
      locations: ["Patan", "Gujarat", "Saraswati river"],
      historical: ["11th century CE", "Solanki dynasty", "Queen Udayamati", "Bhimdev I"],
      keywords: ["stepwell", "vav", "Solanki", "apsara sculptures"],
      persons: ["Queen Udayamati", "Bhimdev I"]
    }
  },
  {
    id: 29, name: "Great Himalayan National Park", state: "Himachal Pradesh", country: "India",
    category: "Natural", year: 2014, emoji: "🏔️",
    description: "The Great Himalayan National Park Conservation Area in the Western Himalayas of Himachal Pradesh encompasses diverse ecosystems from lower scrub and forests through alpine meadows and glaciers to rocky terrain above 6,000 m. Home to snow leopard, brown bear, and western tragopan.",
    keywords: ["Himalayas", "national park", "wildlife", "glacier", "alpine"],
    entities: {
      locations: ["Kullu", "Himachal Pradesh", "Himalayan range", "Jiwa Nal valley"],
      historical: ["1984 national park", "2010 conservation area"],
      keywords: ["snow leopard", "western tragopan", "alpine meadow", "glacier"],
      persons: []
    }
  },
  {
    id: 30, name: "Nalanda Mahavihara", state: "Bihar", country: "India",
    category: "Cultural", year: 2016, emoji: "📚",
    description: "Nalanda Mahavihara (Great Monastery of Nalanda) was a renowned centre of learning in Bihar from the 5th to the 12th century CE, attracting scholars from across Asia. The archaeological remains include temples, monasteries, and meditation halls. Chinese pilgrim Xuanzang studied here in the 7th century.",
    keywords: ["university", "Buddhist", "ancient", "Bihar", "monastery"],
    entities: {
      locations: ["Rajgir", "Bihar", "Nalanda district"],
      historical: ["Gupta Empire", "5th century CE", "Bakhtiyar Khilji attack 1193 CE"],
      keywords: ["Mahavihara", "Buddhist scholarship", "vihara", "Xuanzang"],
      persons: ["Xuanzang", "Aryabhata", "Harsha", "Dharmapala"]
    }
  },
  {
    id: 31, name: "Khangchendzonga National Park", state: "Sikkim", country: "India",
    category: "Mixed", year: 2016, emoji: "⛰️",
    description: "Located in the Himalayas in Sikkim, this is the only mixed World Heritage Site in India. The park encompasses plains, valleys, lakes, glaciers, and snow-capped mountains including Kangchenjunga (8,586 m), the world's third highest peak, considered sacred by local communities.",
    keywords: ["Himalayas", "Sikkim", "glacier", "wildlife", "sacred"],
    entities: {
      locations: ["Sikkim", "Kangchenjunga peak", "Tista river", "Zemu glacier"],
      historical: ["Lepcha mythology", "1977 sanctuary", "2016 UNESCO Mixed"],
      keywords: ["Kangchenjunga", "glacier", "snow leopard", "sacred landscape"],
      persons: []
    }
  },
  {
    id: 32, name: "Le Corbusier's Capitol Complex, Chandigarh", state: "Punjab", country: "India",
    category: "Cultural", year: 2016, emoji: "🏗️",
    description: "The Capitol Complex in Chandigarh was designed by the Swiss-French architect Le Corbusier as part of the new capital of Punjab after Partition. Comprising the Legislative Assembly, the Secretariat, and the High Court, it is considered an outstanding example of the Modern Movement in architecture.",
    keywords: ["modern architecture", "Le Corbusier", "Chandigarh", "urban planning", "Brutalist"],
    entities: {
      locations: ["Chandigarh", "Punjab", "Shivalik foothills"],
      historical: ["1950s post-independence India", "Le Corbusier commission 1950"],
      keywords: ["Brutalism", "Assembly", "Secretariat", "Open Hand monument"],
      persons: ["Le Corbusier", "Pierre Jeanneret", "Jawaharlal Nehru"]
    }
  },
  {
    id: 33, name: "Kakatiya Rudreshwara (Ramappa) Temple", state: "Telangana", country: "India",
    category: "Cultural", year: 2021, emoji: "🛕",
    description: "The Ramappa Temple, also known as the Rudreshwara Temple, was built in 1213 CE by the Recharla Rudra, a general of the Kakatiya ruler Ganapati Deva. Famous for its floating bricks, elegant bracket figures, and exquisite sculptures on every surface.",
    keywords: ["temple", "Telangana", "Kakatiya", "medieval", "sculpture"],
    entities: {
      locations: ["Mulugu", "Telangana", "Pakhal lake", "Warangal"],
      historical: ["Kakatiya dynasty", "1213 CE", "Ganapati Deva"],
      keywords: ["floating bricks", "star-shaped platform", "Kakatiya", "Nayika bracket figures"],
      persons: ["Recharla Rudra", "Ganapati Deva"]
    }
  },
  {
    id: 34, name: "Dholavira: A Harappan City", state: "Gujarat", country: "India",
    category: "Cultural", year: 2021, emoji: "🏺",
    description: "Dholavira is one of the most remarkable and well-preserved urban settlements of the Indus Valley Civilisation (3rd–mid 2nd millennium BCE). Located on Khadir Island in the Rann of Kutch, it is known for its sophisticated water conservation system, urban planning, and a signboard of 10 Indus script signs.",
    keywords: ["Indus Valley", "Gujarat", "Harappan", "ancient", "Bronze Age"],
    entities: {
      locations: ["Kutch", "Gujarat", "Rann of Kutch", "Khadir island"],
      historical: ["3000–1500 BCE", "Bronze Age", "Indus Valley Civilisation"],
      keywords: ["citadel", "water reservoir", "Indus script", "town planning"],
      persons: []
    }
  },
  {
    id: 35, name: "Hoysala Sacred Ensembles", state: "Karnataka", country: "India",
    category: "Cultural", year: 2023, emoji: "🛕",
    description: "The three Hoysala temple ensembles at Belur, Halebidu, and Somnathapura showcase the peak of Hoysala architectural achievement from the 12th–13th centuries CE. The temples are known for their star-shaped platforms and extraordinary soapstone carvings depicting thousands of figures.",
    keywords: ["temple", "Karnataka", "Hoysala", "Dravidian", "soapstone"],
    entities: {
      locations: ["Hassan", "Mysuru", "Karnataka", "Belur", "Halebidu"],
      historical: ["Hoysala Empire", "12th–13th century CE", "Vishnuvardhana"],
      keywords: ["Chennakesava temple", "Hoysaleshwara", "stellate plan", "friezes"],
      persons: ["Vishnuvardhana", "Narasimha III"]
    }
  },
  {
    id: 36, name: "Santiniketan", state: "West Bengal", country: "India",
    category: "Cultural", year: 2023, emoji: "🎨",
    description: "Santiniketan, founded by Debendranath Tagore and developed by his son Rabindranath Tagore, is a small university town near Bolpur in West Bengal. Rabindranath established his experimental open-air school here in 1901, which evolved into Visva-Bharati University.",
    keywords: ["Tagore", "university", "Bengal", "cultural", "arts"],
    entities: {
      locations: ["Bolpur", "West Bengal", "Birbhum district"],
      historical: ["Debendranath Tagore 1863", "Rabindranath Tagore 1901 school", "Nobel Prize 1913"],
      keywords: ["ashram", "open-air school", "Baul music", "folk art"],
      persons: ["Rabindranath Tagore", "Debendranath Tagore"]
    }
  },
  {
    id: 37, name: "Sun Temple, Modhera", state: "Gujarat", country: "India",
    category: "Cultural", year: 2025, emoji: "☀️",
    description: "The Sun Temple at Modhera was built around 1026 CE by King Bhimdev I of the Solanki dynasty. One of the finest examples of Gujarat's medieval temple architecture, it is aligned perfectly with the sun on equinoxes and solstices. The complex includes a pillared assembly hall and a sacred tank.",
    keywords: ["temple", "Gujarat", "Solanki", "sun", "architecture"],
    entities: {
      locations: ["Mehsana", "Gujarat", "Pushpavati river"],
      historical: ["Solanki dynasty", "1026 CE", "Bhimdev I"],
      keywords: ["sun temple", "kund", "Solanki", "Maru-Gurjara"],
      persons: ["Bhimdev I"]
    }
  },
  {
    id: 38, name: "Nagarjunakonda", state: "Andhra Pradesh", country: "India",
    category: "Cultural", year: 1984, emoji: "⛩️",
    description: "Nagarjunakonda island contains the remains of one of the most significant early historic settlements in South India. The site contains several important Buddhist and Brahmanical monuments built by the Ikshvaku dynasty in the 3rd–4th centuries CE.",
    keywords: ["Buddhist", "archaeological", "Andhra Pradesh", "ancient", "stupa"],
    entities: {
      locations: ["Nalgonda", "Andhra Pradesh", "Krishna river"],
      historical: ["Ikshvaku dynasty", "3rd–4th century CE", "Nagarjuna"],
      keywords: ["stupa", "monastery", "Buddhist", "Ikshvaku"],
      persons: ["Nagarjuna"]
    }
  },
  {
    id: 39, name: "Churches and Convents of Goa", state: "Goa", country: "India",
    category: "Cultural", year: 1986, emoji: "⛪",
    description: "The churches and convents of Goa, the former capital of the Portuguese Indies, illustrate the evangelization of Asia. These monuments had a profound influence on the development of architecture, sculpture, and painting in all the countries of Asia where missions were established.",
    keywords: ["colonial", "Portuguese", "church", "Goa", "Christian"],
    entities: {
      locations: ["Old Goa", "Goa", "Mandovi river"],
      historical: ["Portuguese colonial era", "16th century", "1510 conquest"],
      keywords: ["Baroque", "Bom Jesus", "Se Cathedral", "Franciscan"],
      persons: ["Francis Xavier", "Afonso de Albuquerque"]
    }
  },
  {
    id: 40, name: "Sundarbans National Park", state: "West Bengal", country: "India",
    category: "Natural", year: 1987, emoji: "🌊",
    description: "The Sundarbans contains the world's largest mangrove forest, covering about 10,000 sq km across India and Bangladesh. It is home to a large number of rare and globally threatened wildlife species including the Bengal tiger, Ganges river dolphin, estuarine crocodile, and olive ridley sea turtle.",
    keywords: ["mangrove", "tiger", "wildlife", "delta", "national park"],
    entities: {
      locations: ["West Bengal", "Bay of Bengal", "Ganges delta", "Bangladesh border"],
      historical: ["1973 Tiger Reserve", "1984 national park", "1987 UNESCO"],
      keywords: ["Bengal tiger", "mangrove", "estuarine crocodile", "delta"],
      persons: []
    }
  },
  {
    id: 41, name: "Khajuraho Group of Monuments", state: "Madhya Pradesh", country: "India",
    category: "Cultural", year: 1986, emoji: "🛕",
    description: "The Khajuraho temples were built by the Chandela dynasty between 950 and 1050 CE. These temples are famous for their nagara-style architectural symbolism and their erotic sculptures. Of the original 85 temples, only 25 survive today, spread over an area of 20 sq km.",
    keywords: ["temple", "Madhya Pradesh", "Chandela", "sculpture", "medieval"],
    entities: {
      locations: ["Chhatarpur", "Madhya Pradesh", "Vindhya mountains"],
      historical: ["Chandela dynasty", "950–1050 CE", "Yashovarman"],
      keywords: ["nagara style", "erotic sculpture", "Chandela", "Kandariya Mahadeva"],
      persons: ["Yashovarman", "Dhanga"]
    }
  },
  {
    id: 42, name: "Group of Monuments at Aihole, Badami, Pattadakal", state: "Karnataka", country: "India",
    category: "Cultural", year: 1987, emoji: "🏛️",
    description: "The Badami Cave Temples are a complex of Hindu and Jain cave temples carved from the sandstone cliffs of Badami, Karnataka. Dating from the 6th and 7th centuries CE, they were built by the Chalukya dynasty and represent some of the earliest examples of Hindu temple architecture.",
    keywords: ["cave", "Chalukya", "Karnataka", "Hindu", "Jain"],
    entities: {
      locations: ["Bagalkot", "Karnataka", "Agastya lake"],
      historical: ["Chalukya dynasty", "6th–7th century CE", "Mangalesha"],
      keywords: ["cave temple", "Vishnu", "Shiva", "Chalukya"],
      persons: ["Pulakeshin I", "Mangalesha"]
    }
  }
]

// Derived helpers
export const ALL_STATES      = [...new Set(SITES_DATA.map(s => s.state))].sort()
export const ALL_CATEGORIES  = [...new Set(SITES_DATA.map(s => s.category))].sort()
export const ALL_KEYWORDS    = [...new Set(SITES_DATA.flatMap(s => s.keywords || []))].sort()
export const YEAR_RANGE      = { min: Math.min(...SITES_DATA.map(s => s.year)), max: Math.max(...SITES_DATA.map(s => s.year)) }
export const STATS = {
  total:    SITES_DATA.length,
  cultural: SITES_DATA.filter(s => s.category === 'Cultural').length,
  natural:  SITES_DATA.filter(s => s.category === 'Natural').length,
  mixed:    SITES_DATA.filter(s => s.category === 'Mixed').length,
  states:   ALL_STATES.length,
}
