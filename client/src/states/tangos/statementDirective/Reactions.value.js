angular
  .module('tango')
  .value('Reactions', [{
    name: "Strawman",
    class: "strawman",
    description: "You misrepresent someone's argument to make it easier to attack.",
    example: "After Will said that we should put more money into health and education, Warren responded by saying that he was surprised that Will hates our contry so much that he wants to leave it defenceless by cutting military spending.",
  }, {
    name: "False Cause",
    class: 'false-cause',
    description: "You presumed that a real or perceived relationship between things means that one is the cause of the other.",
    example: "Pointing to a fancy chart, Roger shows how temperatures have been rising over the past few centuries, whilst at the same time the numbers of pirates have been decreasing; thus pirates cool the world and global warming is a hoax."
  }, {
    name: "Appeal to Emotion",
    class: "appeal-to-emotion",
    description: "You attempted to manipulate an emotional response in place of a valid or compelling argument.",
    example: "Luke didn't want to eat his sheep's brains with chopped liver and brussel sprouts, but his father told him to think about the poor, starving children in a third world country who weren't fortunate to have food at all."
  }, {
    name: "The Fallacy Fallacy",
    class: "the-fallacy-fallacy",
    description: "You presumed that because a claim has been poorly argued, or a fallacy has been made, that the claim itself must be wrong.",
    example: "Recognizing that Amanda had committed a fallacy in arguing that we should eat healthy food because a nutritionist said it was popular, Alyse said we should therefore eat bacon double cheeseburgers every day."
  }, {
    name: "Slippery Slope",
    class: "slippery-slope",
    description: "You said that if we allow A to happen, then Z will eventually happen too, therefore A should not happen.",
    example: "Colin Closet asserts that if we allow same-sex couples to marry, then the next thing we know we'll be allowing people to marry their parents, their cars and even monkeys."
  }, {
    name: "Ad Hominem",
    class: "ad-hominem",
    description: "You attacked your opponent's character or personal traits in an attempt to undermine their argument.",
    example: "After Sally presents an eloquent and compelling case for a more equitable taxation system, Sam asks the audience whether we should believe anything from a woman who isn't married, was once arrested, and smells a bit weird."
  }, {
    name: "Tu Quoquo",
    class: "tu-quoquo",
    description: "You avoided having to engage with criticism by turning it back on the accuser - you answered criticism with criticism.",
    example: "Nicole identified that Hannah had committed a logical fallacy, but instead of addressing the substance of her claim, Hannah accused Nicole of committing a fallacy earlier on in the conversation."
  }, {
    name: "Personal Incredulity",
    class: "personal-incredulity",
    description: "Because you found something difficult to understand, or are unaware of how it works, you made out like it's probably not true.",
    example: "Kirk drew a picture of a fish and a human and with effusive disdain asked Richard if he really thought we were stupid enough to believe that a fish somehow turned into a human through just, like, random things happening over time."
  }, {
    name: "Special Pleading",
    class: "special-pleading",
    description: "You moved the goalposts or made up an exception when your claim was shown to be false.",
    example: "Edward Johns claimed to be psychic, but when his 'abilities' were tested under proper scientific conditions, they magically disappeared. Edward explained this saying that one had to have faith in his abilities for them to work."
  }, {
    name: "Loaded Question",
    class: "loaded-question",
    description: "You asked a question that had a presumption built into it so that it couldn't be answered without appearing guilty.",
    example: "Grace and Helen were both romantically interested in Brad. One day, with Brad sitting within earshot, Grace asked in an inquisitive tone whether Helen was having any problems with a drug habit."
  }, {
    name: "Burden of Proof",
    class: "burden-of-proof",
    description: "You said that the burden of proof lies not with the person making the claim, but with someone else to disprove.",
    example: "Bertrand declares that a teapot is, at this very moment, in orbit around the Sun between the Earth and Mars, and taht because no one can prove him wrong, his claim is therefore a valid one."
  }, {
    name: "Ambiguity",
    class: "ambiguity",
    description: "You used a double meaning or ambiguity of language to mislead or misrepresent the truth.",
    example: "When the judge asked the defendent why he hadn't paid his parking fines, he said that he shouldn't have to pay them because the sign said 'Fine for parking here' and so he naturally presumed that it would be fine to park there."
  }, {
    name: "The Gambler's Fallacy",
    class: "the-gamblers-fallacy",
    description: "You said that 'runs' occur to statistically independent phenomena such as roulette wheel spins.",
    example: "Red had come up six times in a row on the roulette wheel, so Greg knew that it was close to certain that black would be next up. Suffering an economic form of natural selection with this thinking, he soon lost all his savings."
  }, {
    name: "Bandwagon",
    class: "bandwagon",
    description: "You appealed to popularity or the fact that many people do something as an attempted form of validation.",
    example: "Shamus pointed a drunken finger at Sean and asked him to explain how so many people could believe in leprechauns if they're only a silly old superstition. Sean, however, had had a few too many Guinness himself and fell off his chair."
  }, {
    name: "Appeal to Authority",
    class: "appeal-to-authority",
    description: "You said that because an authority thinks something, it must therefore be true.",
    example: "Not able to defend his position that evolution 'isn't true' Bob says that he knows a scientist who also questions evolution (and presumably isn't a primate)."
  }, {
    name: "Composition/Division",
    class: "composition-division",
    description: "You assumed that one part of something has to be applied to all, or other, parts of it; or that the whole must apply to its parts.",
    example: "Daniel was a precocious child and had a liking for logic. He reasoned that atoms are invisible, and that he was made of atoms and therefore invisible too. Unfortunately, despite his thinky skills, he lost the game of hide and go seek."
  }, {
    name: "No True Scotsman",
    class: "no-true-scotsman",
    description: "You made what could be called an appeal to purity as a way to dismiss relevant criticisms or flaws of your argument.",
    example: "Angus declares that Scotsmen do not put sugar on their porridge, to which Lachlan points out that he is a Scotsman and puts sugar on his porridge. Furious, like a true Scot, Angus yells that no true Scotsman sugars his porridge."
  }, {
    name: "Genetic",
    class: "genetic",
    description: "You judged something as either good or bad on the basis of where it comes from, or from whom it came.",
    example: "Accused on the 6 o'clock news of corruption and taking bribes, the senator said that we should all be very wary of the things we hear in the media, because we all know how very unreliable the media can be."
  }, {
    name: "Black Or White",
    class: "black-or-white",
    description: "You presented two alternative states as the only possibilities, when in fact more possibilities exist.",
    example: "Whilst rallying support for his plan to fundamentally undermine citizens' rights, the Supreme Leader told the people they were either on his side, or they were on the side of the enemy."
  }, {
    name: "Begging the Question",
    class: "begging-the-question",
    description: "You presented a circular argument in which the conclusion was incuded in the premise.",
    example: "The word of Zorbo the Great is flawless and perfect. We know this because it says so in The Great and Infallible Book of Zorbo's Best and Most Truest Things that are Definitely True and Should Not Ever Be Questioned."
  }, {
    name: "Appeal to Nature",
    class: "appeal-to-nature",
    description: "You argued that because something is 'natural' it is therefore valid, justified, inevitable, good, or ideal.",
    example: "The medicine man rolled into town on his bandwagon offering various natural remedies, such as very special plain water. He said that it was only natural that people should be wary of 'artificial' medicines such as antibiotics."
  }, {
    name: "Anecdotal",
    class: "anecdotal",
    description: "You used a personal experience or an isolated example instead of a sound argument or compelling evidence.",
    example: "Jason said that that was all cool and everything, but his grandfather smoked, like, 30 cigarettes a day and lived until 97 - so don't believe everything you read about meta analyses of methodologically sound studies showing proven causal relationships."
  }, {
    name: "The Texas Sharpshooter",
    class: "the-texas-sharpshooter",
    description: "You cherry-picked a data cluster to suit your argument, or found a pattern to fit a presumption.",
    example: "The makers of a Sugarette Candy Drinks point to research showing that of the five countries where Sugarette drinks sell the most units, three of them are in the top ten healthiest countries on Earth, therefore Sugarette drinks are healthy."
  }, {
    name: "Middle Ground",
    class: "middle-ground",
    description: "You claimed that a compromise, or middle point, between two extremes must be the truth.",
    example: "Holly said that cavvinations caused autism in children, but her scientifically well-read friend Caleb said that this claim has been debunked and proven false. Their friend Alice offered a compromise that cavvinations must cause some autism, just not all autism."
  }])
;
