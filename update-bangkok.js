/** @format */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateBangkokContent() {
	try {
		const bangkokContent = `
    <p>Did you know that Bangkok is the capital city with the longest name in the world? Indeed, the full name of Bangkok is the following:"Krung Thep Mahanakhon Amon Rattanakosin Mahinthara Ayuthaya Mahadilok Phop Noppharat Ratchathani Burirom Udomratchaniwet Mahasathan Amon Piman Awatan Sathit Sakkathattiya Witsanukam Prasit". This can be translated as: The city of angels, the great city, the residence of the Emerald Buddha, the impregnable city (unlike Ayutthaya) of God Indra, the grand capital of the world endowed with nine precious gems, the happy city, abounding in an enormous Royal Palace that resembles the heavenly abode where reigns the reincarnated god, a city given by Indra and built by Vishnukarn." Bangkok is a city that has had its up and downs throughout the history.</p>

    <p>At one point it's a popular tourist centre, but over the past decades it has also garnered a different kind of reputation, one that doesn't do much favours: to be the Asian center of prostitution. In the recent years the city does all its best to get rid of this questionable fame and to show its visitors, that it's so much more, than being a huge red lamp district.</p>

    <p>In this blog, we would like to reflect on the best places to visit for tourists in Bangkok, a city which has really grown to become a large metropolis, slowly but surely becoming one of the key cities of Southeast Asia.</p>

    <h2>Introduction:</h2>
     
    <p>Bangkok is beautiful, in fact it is so charming and unique, with its countless canals and sampans floating on the water that it has become the main scene for countless movies from the Seventies with James Bond: man with the golden gun being the movie which has ultimately made the city world famous. Indeed thousands of tourists arrive in Bangkok on a daily basis and this makes the city a key tourist center in Southeast Asia. However, the floating market and the old downtown area is now only one fragment of all the sites to visit here. Let's enlist some of the best places to visit, the best things to do and the best day trips you can take when you are in Bangkok, Thailand.</p>

    <p>Bangkok is also a chaotic city, that's always on the run. Its busy streets are always packed with people night and day. It's a city, which leaves many people exhausted because of its extreme lifestyle. It's also a place where it's very easy for a stranger to get lost. That's also why many people who want to hide choose Bangkok as their main destination. Thanks to it being very cheap, the number of international residents is substantially growing every year.</p>

    <p>Culture: Bangkok is a real melting pot of diverse Asian cultures. Besides the original Thai locals there is a high number of Chinese and Indians living in Bangkok besides Malays, Indonesian and Filipinos. This makes for an extremely colorful culture, shopping opportunities and what's even more important it can provide you with an excellent culinary experience too. As for the religion, Thai people cultivate the Theravada type of Buddhism which is proven in its exceptional looking temples, palaces and monasteries all built in a very unique Thai style.</p>

    <h2>The best places to visit in Bangkok:</h2>

    <ol style="list-style-type:decimal!important" class="mb-10">
    <li>
    <h3> The Grand Palace </h3>

    <p>Located right in the Middle of the old downtown area, the Grand Palace and its whole area would make you explore some of the most beautiful tourist spots in one. This complex contains the Royal Palace, the Wat Phra and also has several beautiful monasteries and gates to explore.</p>
    <p>The Grand Palace was built back in the 1700 s and it's a joint effort of British and Thai architects, therefore it bears the signs of both renaissance and Thai architectural styles. The palace used to be the Royal residence up until recently but it is still used as the place of formal reception to this day. You can visit some key parts of the Grand Palace but you must make sure that you are dressed fine and modestly.</p>
    </li>

    <li>

    <h3>Wat Phra Kaew or 'The Temple of the Emerald Buddha' </h3>

    <p>
    The temple is located inside the Grand Palace and therefore the two complexes are often mentioned together. The temple itself is visited by thousands on a daily basis, making it the highest visited temple in Bangkok. Its Jade Buddha is 66 cm tall and looks exquisite. Furthermore the temple has a 2 kms long alley featuring beautifully painted murals on the life of Buddha and contains lots of information about the religion.</p>
    </li>

    <li>

    <h3>Wat Pho – Temple of the Reclining Buddha</h3>

    <p>
    This picturesque temple is also located next to the Grand Palace making it a top tourist destination. According to the locals, the reclining Buddha has healing properties. This theory is further supported by the presence of a medical school, whose students are more than happy to represent their healing massage skills on tourists too. The temple is home to 91 stupas and exactly one thousand images which all feature Buddha.</p>
    </li>

    <li> 
    <h3>Wat Arun </h3>
    <p>
    This beautiful riverside temple is one of the key landmarks of Bangkok and it's been built in "khmer" style also celebrating Theravada Buddhism. As per this style the central main tower is surrounded by 4 smaller towers all of which are heavily decorated. Visitors get the chance to walk all the way up to the top of the main tower and witness the scenic views to the city. Take care however as the steps are very steep.</p>
    </li>

    <li> 
    <h3>Wat Traimit</h3>

    <p>Situated right next to the city's Chinatown area Wat Traiming is an exceptionally looking multilevel temple which features the largest (5 meter tall) pure gold statue of Buddha seated inside. To make its story even more interesting, the Buddha was long covered with a maze to hide its real value. The fact that it's made out of gold was revealed accidentally in 1955.</p>
    </li>

    <li>

    <h3>Wat Mahatat</h3>

    <p>This is another very popular and well known temple featured in many movies. It's known for the dozens of statues all featuring a seated Buddha. Thanks to its location being between the Grand Palace and the Royal Palace make it easy to visit.</p>

    </li>
    </ol>

    <h2>Things to do in Bangkok:</h2>

    <ul style="list-style-type:disc !important;" class="mb-10">
    <li>Find a floating market</li>
    <li>Explore the Chinatown</li>
    <li>Go on a river course along Chao Praia river</li>
    <li>Explore the Khao San Road</li>
    <li>Visit Soi Cowboy night district to explore the nightlife</li>
    <li>Visit Jim Thompson's house if you want to learn more about silk trade and how Thompson has managed to revive the famous Thai silk trade when it was on the brink of extinction.
      <ul class="mb-10" style="list-style-type:disc !important;">
        <li>Go on a food tour</li>
        <li>Check out a Thai boxing event at Lumpini Stadium</li>
        <li>Taste food at street food stalls </li>
      </ul>
    </li>

    <p>Peaceful places inside Bangkok to find serenity: According to even the locals Bangkok is so busy and so chaotic that it would leave everyone exhausted after a couple of days. The following places while situated inside of Bangkok would feel like you are outside of the city, they are so calm.</p>

    <ul class="mb-10" style="list-style-type:disc !important;">
    <li>
    The Gold Mountain: a lovely mountain area which is surprisingly close to downtown yet it's calm and beautiful. </li>

    <li>Phu Khao Thong: this is a lovely jungle park where you can relax in peace listening to tbe wildlife around you. </li>

    <li>Located nearby Golden Mountain, this is a real oasis and it also gives great views to the busy downtown.</li>

    <li>Loha Prasat: this is an exceptional looking beautiful temple which surprisingly features 37 turrets, with each one representing one way of happiness. Thanks to it not being a tourist site one can find peace and quiet in here.</li>

    <li>Lumpini Park: often called the only park in Bangkok, this part is large, it has its manmade lake and it's home to all sorts of outdoor activities from Tai Chi to tennis. </li>

    <li>Supatra River House: situated right by the river this wonderful restaurant gives a great escape from the crowds and from the heat as well. </li>
    </ul>

    <h2>Day trips outside Bangkok:</h2>
    <p>While most would suggest you to visit Ayutthaya, I would rather suggest you to visit Chiang Mai or Chiang Rai. These are longer tours and they may also include one or two sleepovers but they are well worth it. They would show you more of a real side of Thailand.</p>
    <p>If you have more than a few days, check out Pattaya or Phi-Phi Island which are highly regarded as the top seaside resorts of Thailand.</p>

    <p><strong>People:</strong> Thai people are exceptionally kind and hospitable people and this is a feature which made so many foreigners decide to settle in Thailand.</p>
    <p>
      <strong>Shopping:</strong>  Bangkok is full of marketplaces such as the well-known Chatuchak Market that's very popular of selling artefacts from all over Thailand, China and Southeast Asia.
    </p>
    <p>If you want to check out a good shopping mall then check out Terminal 21 which is today's most popular places for shopping.</p>

    <h3>Insider tips on visiting Bangkok:</h3>
    <ul class="mb-10" style="list-style-type:disc !important;">
      <li>Learn a few basic Thai phrases to help you get around and connect with locals.</li>
      <li>Dress modestly when visiting temples and remove your shoes before entering.</li>
      <li>Be cautious when using tuk-tuks and negotiate the fare beforehand.</li>
      <li>Try to avoid peak traffic hours, as Bangkok is known for its congestion.</li>
      <li>Stay hydrated and take breaks in the shade to avoid heat exhaustion.</li>
      <li>Use public transportation like the BTS Skytrain or MRT subway to navigate the city efficiently.</li>
      <li>Respect local customs and traditions, especially in religious sites.</li>
      <li>Be mindful of your belongings and be cautious of scams targeting tourists.</li>
      <li>Consider hiring a local guide for a more enriching experience.</li>
      <li>Explore beyond the tourist hotspots to discover hidden gems and local experiences.</li>
      <li>Don't be afraid to try street food, but make sure to choose busy stalls with high turnover for the freshest options.</li>
      <li>While there are some fun activities for kids the city is not the very best place for families with small kids to visit.</li>
    </ul>
    `;

		const updatedPost = await prisma.blogPost.update({
			where: { city: 'Bangkok' },
			data: {
				content: bangkokContent.trim(),
				excerpt:
					"Discover Bangkok's incredible temples, floating markets, vibrant street life, and hidden peaceful spots. From the Grand Palace to street food tours, explore Thailand's bustling capital city.",
			},
		});

		console.log('Updated Bangkok blog post:', updatedPost.city);
	} catch (error) {
		console.error('Error updating Bangkok content:', error);
	} finally {
		await prisma.$disconnect();
	}
}

updateBangkokContent();
