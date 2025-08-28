export const blogDetails: Record<
  string,
  {
    title: string;
    image: string;
    excerpt: string;
    paragraphs: string[];
  }
> = {
  paris: {
    title: "Paris: The City of Lights",
    image: "/popdest/paris.jpg",
    excerpt: "Experience the romance, art, and cuisine of Paris. Discover the Eiffel Tower, Louvre, and charming cafes.",
    paragraphs: [
      "Paris is a city that enchants visitors with its timeless beauty and vibrant culture. The streets are lined with historic architecture, and every corner offers a glimpse into the city's rich past. From the bustling boulevards to the quiet alleyways, Paris invites exploration.",
      "The culinary scene in Paris is world-renowned, with patisseries, bistros, and Michelin-starred restaurants serving up delectable treats. Savoring a croissant at a local café while watching the world go by is a quintessential Parisian experience. The city's markets overflow with fresh produce and artisanal goods.",
      "Art lovers will find endless inspiration in Paris, home to the Louvre, Musée d'Orsay, and countless galleries. The city's artistic legacy is evident in its public spaces, where sculptures and murals add character to the urban landscape. Street performers and musicians bring energy to the city’s squares.",
      "Paris is also a city of romance, with the Seine River providing a picturesque backdrop for evening strolls. Couples can enjoy boat rides, candlelit dinners, and breathtaking views from the top of the Eiffel Tower. The city's gardens and parks offer peaceful retreats from the urban bustle.",
      "Shopping in Paris is a delight, from luxury boutiques on the Champs-Élysées to quirky shops in Le Marais. Fashionistas flock to the city for its cutting-edge style and timeless elegance. Whether you're searching for haute couture or vintage treasures, Paris has something for everyone.",
    ],
  },
  london: {
    title: "London: Tradition Meets Modernity",
    image: "/popdest/london.jpg",
    excerpt: "Explore historic landmarks, vibrant markets, and world-class museums in London.",
    paragraphs: [
      "London is a city where centuries-old traditions blend seamlessly with modern innovation. Iconic landmarks like Big Ben and Buckingham Palace stand alongside contemporary skyscrapers, creating a dynamic skyline. The city’s history is woven into every street and building.",
      "The cultural scene in London is second to none, with theaters, galleries, and music venues hosting world-class performances. The West End is famous for its dazzling shows, while museums like the British Museum and Tate Modern showcase art and artifacts from around the globe.",
      "London’s markets are a feast for the senses, offering everything from gourmet food to vintage clothing. Borough Market is a haven for foodies, while Camden Market attracts those seeking unique finds. The city’s diverse neighborhoods each have their own character and charm.",
      "Green spaces abound in London, with parks like Hyde Park and Regent’s Park providing a welcome escape from the urban hustle. Locals and visitors alike enjoy picnics, boating, and open-air concerts in these lush settings. The Thames River winds through the city, offering scenic walks and boat tours.",
      "Dining in London is an adventure, with cuisines from every corner of the world represented. From traditional fish and chips to innovative fusion dishes, the city’s restaurants cater to every palate. Afternoon tea remains a beloved ritual, enjoyed in elegant hotels and cozy cafés.",
    ],
  },
  rome: {
    title: "Rome: Eternal City",
    image: "/popdest/rome.webp",
    excerpt: "Walk through ancient ruins, taste authentic Italian food, and marvel at Renaissance art in Rome.",
    paragraphs: [
      "Rome is a living museum, where ancient ruins coexist with vibrant modern life. The Colosseum, Roman Forum, and Pantheon are testaments to the city’s storied past. Wandering through Rome’s streets is like stepping back in time.",
      "Italian cuisine shines in Rome, with trattorias serving up classic dishes like pasta carbonara and Roman-style pizza. Fresh ingredients and traditional recipes make every meal memorable. Gelato shops tempt with a rainbow of flavors, perfect for a sweet treat on a sunny day.",
      "Art and architecture are everywhere in Rome, from Renaissance masterpieces in the Vatican Museums to Baroque fountains in public squares. The city’s churches and palaces are adorned with frescoes, mosaics, and sculptures that tell the story of its artistic heritage.",
      "Rome’s piazzas are the heart of city life, bustling with locals and tourists alike. Outdoor cafés offer the perfect spot to relax and people-watch. Street performers and artists add to the lively atmosphere, making every visit unique.",
      "Shopping in Rome ranges from luxury boutiques near the Spanish Steps to bustling markets selling local crafts and produce. The city’s fashion scene is both classic and contemporary, reflecting Italy’s reputation for style and elegance.",
    ],
  },
  barcelona: {
    title: "Barcelona: Gaudí’s Playground",
    image: "/popdest/barcelona.jpg",
    excerpt: "Enjoy Gaudí architecture, sunny beaches, and lively culture in Barcelona.",
    paragraphs: [
      "Barcelona is a city of creativity and color, where the works of Antoni Gaudí define the landscape. The Sagrada Família and Park Güell are must-see landmarks, showcasing the architect’s unique vision. The city’s streets are filled with artistic flair.",
      "The Mediterranean coastline provides Barcelona with beautiful beaches, perfect for sunbathing, swimming, and water sports. Barceloneta Beach is a favorite among locals and visitors, offering lively bars and restaurants along the promenade.",
      "Barcelona’s culinary scene is a celebration of Catalan flavors, with tapas bars and seafood restaurants serving up delicious dishes. The city’s markets, like La Boqueria, are a feast for the senses, brimming with fresh produce and local specialties.",
      "Culture thrives in Barcelona, with festivals, concerts, and exhibitions taking place throughout the year. The Gothic Quarter is a maze of narrow streets and historic buildings, while the modernist architecture of Eixample adds a contemporary touch.",
      "Nightlife in Barcelona is vibrant, with clubs, bars, and live music venues catering to every taste. The city’s energy is infectious, making it a popular destination for those seeking fun and excitement after dark.",
    ],
  },
  istanbul: {
    title: "Istanbul: Where East Meets West",
    image: "/popdest/istanbul.webp",
    excerpt: "Discover the crossroads of Europe and Asia, with stunning mosques and bustling bazaars.",
    paragraphs: [
      "Istanbul is a city of contrasts, where ancient history meets modern life. The skyline is dominated by grand mosques and palaces, while bustling markets and lively streets reflect the city’s vibrant culture. The Bosphorus Strait divides Europe and Asia, adding to Istanbul’s unique character.",
      "The city’s culinary scene is a blend of flavors from both continents, with street food like simit and kebabs enjoyed alongside gourmet dining. Turkish tea and coffee are staples, served in traditional cafés and tea gardens.",
      "Istanbul’s bazaars are legendary, with the Grand Bazaar and Spice Bazaar offering a dizzying array of goods. Shoppers can find everything from carpets and jewelry to spices and sweets. Bargaining is part of the experience, adding excitement to every purchase.",
      "Historic sites abound in Istanbul, from the Hagia Sophia and Blue Mosque to Topkapi Palace. These landmarks tell the story of empires and civilizations that have shaped the city over centuries. Guided tours provide insight into Istanbul’s rich heritage.",
      "Nightlife in Istanbul is diverse, with rooftop bars, nightclubs, and live music venues offering entertainment for every taste. The city’s waterfront comes alive at night, with locals and visitors enjoying the views and vibrant atmosphere.",
    ],
  },
  newyork: {
    title: "New York: The City That Never Sleeps",
    image: "/popdest/newyork.webp",
    excerpt: "Experience the energy of NYC, from Central Park to Broadway and iconic skyscrapers.",
    paragraphs: [
      "New York City is a global metropolis, known for its towering skyscrapers and bustling streets. Times Square, Central Park, and the Statue of Liberty are iconic landmarks that define the city’s character. The energy of NYC is palpable at every turn.",
      "The city’s cultural scene is unmatched, with Broadway theaters, world-class museums, and art galleries showcasing creativity from around the world. The Metropolitan Museum of Art and MoMA are must-visit destinations for art lovers.",
      "Dining in New York is an adventure, with cuisines from every corner of the globe represented. Food trucks, fine dining, and neighborhood eateries offer endless options. Bagels, pizza, and street pretzels are local favorites.",
      "Shopping in NYC ranges from luxury boutiques on Fifth Avenue to quirky shops in SoHo and Williamsburg. The city’s fashion scene is both cutting-edge and classic, attracting style enthusiasts from around the world.",
      "Nightlife in New York is legendary, with bars, clubs, and live music venues open late into the night. Rooftop lounges offer stunning views of the city skyline, while jazz clubs and speakeasies provide a taste of old-school glamour.",
    ],
  },
  sydney: {
    title: "Sydney: Harbour City",
    image: "/popdest/sydney.webp",
    excerpt: "Visit the Sydney Opera House, Bondi Beach, and enjoy Australia’s laid-back lifestyle.",
    paragraphs: [
      "Sydney is a city defined by its stunning harbor, with the Sydney Opera House and Harbour Bridge as its crown jewels. Ferries crisscross the water, offering scenic views of the city’s skyline and waterfront neighborhoods.",
      "The beaches of Sydney are world-famous, with Bondi Beach attracting surfers, swimmers, and sunbathers. Coastal walks connect the city’s beaches, providing breathtaking views and opportunities for outdoor adventure.",
      "Sydney’s food scene is diverse and innovative, with fresh seafood, multicultural flavors, and trendy cafés. The city’s markets, like Paddy’s Market, are great places to sample local produce and artisanal goods.",
      "Culture thrives in Sydney, with theaters, galleries, and festivals celebrating the city’s creative spirit. The Rocks district is a hub of history and entertainment, with cobblestone streets and lively pubs.",
      "Nature is never far away in Sydney, with national parks, botanical gardens, and wildlife reserves offering escapes from urban life. Whale watching, hiking, and kayaking are popular activities for locals and visitors alike.",
    ],
  },
  tokyo: {
    title: "Tokyo: Tradition and Technology",
    image: "/popdest/tokyo.webp",
    excerpt: "Immerse yourself in Tokyo’s blend of tradition and technology, sushi, and cherry blossoms.",
    paragraphs: [
      "Tokyo is a city of contrasts, where ancient temples stand beside neon-lit skyscrapers. The city’s neighborhoods each have their own personality, from the historic streets of Asakusa to the futuristic vibe of Shibuya.",
      "Japanese cuisine is celebrated in Tokyo, with sushi, ramen, and street food available at every turn. Tsukiji Market is a paradise for food lovers, offering fresh seafood and local delicacies.",
      "Culture and entertainment abound in Tokyo, with museums, theaters, and festivals showcasing the city’s creative energy. Cherry blossom season transforms parks and gardens into a sea of pink, drawing crowds from around the world.",
      "Shopping in Tokyo is an adventure, with department stores, boutiques, and quirky shops selling everything from fashion to electronics. Akihabara is a haven for tech enthusiasts and anime fans.",
      "Nightlife in Tokyo is vibrant, with izakayas, karaoke bars, and nightclubs catering to every taste. The city’s skyline sparkles after dark, offering endless opportunities for fun and exploration.",
    ],
  },
  capetown: {
    title: "Cape Town: Beauty at the Tip of Africa",
    image: "/popdest/capetown.webp",
    excerpt: "Explore Table Mountain, beautiful beaches, and vibrant culture in Cape Town.",
    paragraphs: [
      "Cape Town is a city of breathtaking landscapes, with Table Mountain providing a dramatic backdrop. The city’s beaches, like Camps Bay and Clifton, are perfect for relaxation and water sports.",
      "The V&A Waterfront is a hub of activity, with shops, restaurants, and entertainment options for all ages. Boat tours offer stunning views of the harbor and coastline.",
      "Cape Town’s culinary scene is diverse, with fresh seafood, local wines, and fusion cuisine reflecting the city’s multicultural heritage. Markets and food festivals are popular with locals and visitors alike.",
      "History comes alive in Cape Town, with sites like Robben Island and the District Six Museum telling the story of the city’s past. Guided tours provide insight into South Africa’s journey to democracy.",
      "Nature lovers will find plenty to explore, from hiking trails on Table Mountain to wildlife encounters in nearby reserves. The city’s botanical gardens and scenic drives showcase the region’s natural beauty.",
    ],
  },
  bangkok: {
    title: "Bangkok: The City of Angels",
    image: "/popdest/bangkok.jpg",
    excerpt: "Discover temples, street food, floating markets, and vibrant nightlife in Bangkok.",
    paragraphs: [
      "Bangkok is a city where ancient traditions blend seamlessly with modern life. Golden temples and gleaming skyscrapers create a stunning contrast against the bustling streets. The Chao Phraya River flows through the heart of the city, offering scenic boat rides and waterfront dining.",
      "The street food scene in Bangkok is legendary, with vendors serving up authentic pad thai, mango sticky rice, and spicy som tam on every corner. Floating markets like Damnoen Saduak offer a unique shopping experience, with boats laden with fresh fruits and local delicacies.",
      "Buddhist temples, or 'wats', are scattered throughout Bangkok, each more beautiful than the last. Wat Pho houses a massive reclining Buddha, while Wat Arun's spires pierce the sky. These sacred spaces offer tranquility amidst the city's hustle and bustle.",
      "Shopping in Bangkok ranges from luxury malls like Siam Paragon to bustling markets like Chatuchak Weekend Market. The city is famous for its silk, handicrafts, and designer knock-offs. Bargaining is part of the fun and expected in most markets.",
      "Bangkok's nightlife is vibrant and diverse, from rooftop bars with panoramic city views to lively night markets and entertainment districts. The city truly comes alive after dark, offering endless opportunities for fun and adventure.",
    ],
  },
  dubai: {
    title: "Dubai: City of Gold and Dreams",
    image: "/popdest/dubai.jpg",
    excerpt: "Experience luxury shopping, stunning architecture, and desert adventures in Dubai.",
    paragraphs: [
      "Dubai is a city that defies limits, with record-breaking skyscrapers and man-made islands that showcase human ingenuity. The Burj Khalifa towers over the city, offering breathtaking views from its observation decks. Palm Jumeirah and The World islands are engineering marvels that must be seen to be believed.",
      "Luxury shopping is a way of life in Dubai, with massive malls like Dubai Mall and Mall of the Emirates housing international brands and unique attractions. The Gold Souk and Spice Souk in old Dubai offer a more traditional shopping experience, filled with aromatic spices and glittering jewelry.",
      "The desert surrounding Dubai provides endless adventure opportunities. Dune bashing, camel riding, and desert safaris offer thrills and glimpses into traditional Bedouin culture. Luxury desert camps provide five-star comfort under the stars.",
      "Dubai's culinary scene is as diverse as its population, with world-class restaurants serving everything from traditional Emirati cuisine to international fusion dishes. Fine dining establishments offer spectacular views and innovative menus that rival any global destination.",
      "Entertainment in Dubai is spectacular, from water shows at Dubai Fountain to indoor skiing at Ski Dubai. The city's beaches offer relaxation and water sports, while theme parks and attractions provide family-friendly fun.",
    ],
  },
  singapore: {
    title: "Singapore: The Garden City",
    image: "/popdest/singapore.webp",
    excerpt: "Explore the garden city with its modern skyline, diverse cuisine, and cultural attractions.",
    paragraphs: [
      "Singapore is a marvel of urban planning, where lush gardens and green spaces are seamlessly integrated into the cityscape. Gardens by the Bay features futuristic Supertrees and climate-controlled conservatories that showcase plants from around the world. The Singapore Botanic Gardens, a UNESCO World Heritage site, offers a tranquil escape in the heart of the city.",
      "The food scene in Singapore is unparalleled, with hawker centers serving affordable and delicious dishes from various Asian cuisines. Hainanese chicken rice, laksa, and chili crab are must-try local specialties. High-end restaurants also thrive here, with the city boasting numerous Michelin-starred establishments.",
      "Cultural diversity is Singapore's strength, with distinct neighborhoods like Chinatown, Little India, and Arab Street each offering unique experiences. Temples, mosques, and cultural centers provide insight into the various communities that call Singapore home.",
      "Modern attractions make Singapore a family-friendly destination. Sentosa Island features theme parks, beaches, and entertainment complexes. The Singapore Flyer and Marina Bay Sands offer stunning views of the city skyline.",
      "Shopping in Singapore ranges from luxury boutiques on Orchard Road to unique finds in ethnic quarters. The city's efficient public transport system makes it easy to explore different neighborhoods and attractions.",
    ],
  },
  "hong kong": {
    title: "Hong Kong: Pearl of the Orient",
    image: "/popdest/hongkong.jpg",
    excerpt: "Experience the fusion of East and West with stunning harbor views and dim sum.",
    paragraphs: [
      "Hong Kong is a city where East meets West, creating a unique blend of cultures and cuisines. Victoria Harbour provides stunning views, especially during the Symphony of Lights show. The iconic skyline is best appreciated from the Star Ferry, a historic boat service that has been operating for over a century.",
      "Dim sum culture thrives in Hong Kong, with traditional tea houses and modern restaurants serving delicate dumplings and small plates. Street food stalls offer local favorites like egg waffles and fish balls. The city's food scene ranges from Michelin-starred establishments to humble dai pai dong (street food stalls).",
      "Shopping is a passion in Hong Kong, from luxury malls in Central and Causeway Bay to bustling street markets in Mong Kok and Stanley. The city is famous for its custom tailoring, electronics, and designer goods at competitive prices.",
      "Cultural attractions abound, from traditional temples like Man Mo Temple to contemporary art galleries. The Hong Kong Museum of History and Heritage Museum provide insight into the city's rich past and cultural heritage.",
      "Nature escapes are surprisingly accessible in Hong Kong, with hiking trails offering spectacular views of the city and surrounding islands. Dragon's Back trail and Victoria Peak are popular destinations for outdoor enthusiasts.",
    ],
  },
};