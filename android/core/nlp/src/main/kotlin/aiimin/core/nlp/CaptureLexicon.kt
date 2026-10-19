package aiimin.core.nlp

/** Word lists for the capture engine. All entries are lower-case, in the canonical Hinglish spelling the normaliser produces. */
internal object CaptureLexicon {

    private fun words(s: String) = s.trim().split(Regex("""[\s,]+""")).filter { it.isNotEmpty() }.toSet()
    fun rx(set: Set<String>, ignoreCase: Boolean = true): Regex =
        Regex("""\b(?:${set.sortedByDescending { it.length }.joinToString("|") { Regex.escape(it) }})\b""", if (ignoreCase) setOf(RegexOption.IGNORE_CASE) else emptySet())

    /** A verb that says money left: with a certain amount it makes an expense. */
    val SPEND_VERBS = words(
        """paid spent spend gave give bought cost costs charged charges purchase purchased pd tipped donated lent returned repaid transferred sent split
        gifted kharch diye diya di liya li liye kiya kiye bheje bheja bhara bhari bhare kharida kharidi dalwaya dalwai uda udaye lagi lagae jama khaya piya udhaar""",
    )
    /** Verbs that are only a spend when an amount follows ("buy milk" is a task, "buy 2kg rice 120" an expense). */
    val WEAK_SPEND = words("pay buy order book get")
    val INCOME_CUES = words(
        """received receive got salary credited refund refunded cashback bonus dividend interest income earned sold reimbursed reimbursement mila mili aaya aayi aaye wapas""",
    )

    val SPEND_NOUNS = words(
        """lunch dinner breakfast brunch snack snacks coffee chai tea pizza burger biryani paratha samosa maggi juice ice cream icecream dessert sweets mithai food khana nashta paan
        swiggy zomato dominos starbucks kfc mcdonalds restaurant cafe hotel meal tiffin thali dosa idli
        groceries grocery vegetables veggies sabzi fruits fruit milk doodh curd eggs bread atta dal rice oil sugar ration kirana provisions bigbasket blinkit zepto dmart supermarket
        uber ola rapido auto rickshaw cab taxi metro bus train ticket tickets flight flights petrol diesel fuel cng fastag toll parking bike scooter car service servicing
        bill bills electricity bijli wifi broadband internet recharge dth gas cylinder water maid cook driver newspaper
        rent kiraya emi loan insurance premium lic sip tax fees fee tuition school college course class coaching books book stationery
        movie movies netflix prime hotstar spotify subscription gym yoga salon haircut barber spa laundry dry cleaning iron
        medicine medicines dawai dawa doctor consultation pharmacy hospital test lab dentist checkup
        shopping clothes shirt shirts jeans shoes shoe bag watch phone mobile laptop charger repair gift gifts flowers flower toy toys
        tip tips donation charity temple pooja puja udhaar fine penalty courier delivery shipping amazon flipkart myntra meesho
        pet vet trip travel booking hostel stay popcorn chemist autorickshaw payment deposit advance down gifted worth""",
    )

    val TASK_VERBS = words(
        """call email mail message text whatsapp ping book renew send submit pay order clean fix visit pick drop meet write review plan print charge water cancel buy collect
        return schedule update check remind finish prepare prep organize organise arrange set ask tell take bring get go wash cook make file apply register confirm follow complete
        start practice study read pack sell post upload download install backup change replace repair service wake remember reply respond ship deploy debug draft cleanup fill
        renewal revise research watch attend join wish thank invite share transfer deposit withdraw recharge""",
    )
    /** Hindi infinitives: "karna", "jaana hai". */
    val INFINITIVES = words(
        """karna karni karne bharna bharni bharne jaana jana jaane jani lena leni lene dena deni dene milna milni bhejna bhejni bhejne uthna laana lana lani dhona rakhna rakhni
        batana puchna dekhna likhna padhna sunna khelna sona jagna nikalna chalana pakana bulana khareedna kharidna lagana bhoolna dhoondna sikhna saaf""",
    )
    val TASK_LEAD_PHRASES = listOf(
        Regex("""^(?:please\s+)?(?:remind me(?: to)?|need to|have to|i need to|i have to|dont forget(?: to)?|don't forget(?: to)?|do not forget(?: to)?|yaad dilana|yaad se|mujhe)\b""", RegexOption.IGNORE_CASE),
    )

    val EVENT_NOUNS = words(
        """meeting appointment interview flight birthday bday wedding anniversary class webinar standup stand-up party concert match exam lecture session demo presentation
        trip train bus movie conference seminar workshop ceremony function puja lunch dinner breakfast brunch reunion picnic farewell gathering annual""",
    )
    val EVENT_WITH = Regex("""\b(?:call|lunch|dinner|breakfast|coffee|drinks|catch ?up|meeting|movie|trip|party|sync|brunch|chat) with\b|\b(?:doctor|dentist|clinic|hospital)\s+visit\b""", RegexOption.IGNORE_CASE)

    val JOURNAL_WORDS = words(
        """feeling felt feel mood anxious anxiety grateful gratitude tired irritated rough stressed stress happy sad low drained proud lonely angry calm excited nervous worried hopeful
        overwhelmed exhausted thakan thakawat bechain ghabrahat chinta sukoon heavy thaka thaki khush udaas pareshan tension tanav mann dil racing""",
    )
    val JOURNAL_PHRASES = Regex("""accha laga|bura laga|din bahut accha|aaj ka din|couldn'?t sleep|could not sleep|mind racing|nahi lag raha|mann nahi""", RegexOption.IGNORE_CASE)

    val DOC_NOUNS = words(
        """passport licence license dl insurance puc fastag warranty agreement aadhaar aadhar visa pan lease rc permit certificate membership policy registration lic""",
    )
    val DOC_CUES = Regex("""\b(?:expires?|expired|expiry|expiring|renewal|renews|valid(?: till| until)?|due|ends?|ending|hoga)\b""", RegexOption.IGNORE_CASE)

    val MIN_VERBS = words(
        """walked walking walk ran run running jogged cycle cycling chalayi jog swim lifted trained read reading meditated meditation drank slept studied cycled swam did done stretch stretching yoga workout exercised padhe padha padhai chala chale paidal""",
    )
    val MIN_UNIT = Regex("""\d+(?:\.\d+)?\s*(?:k\b|km\b|min(?:ute)?s?\b|hours?\b|hrs?\b|pages?\b|litres?\b|liters?\b|glasses\b|pushups\b|reps\b|steps\b|ghante\b|minute\b)""", RegexOption.IGNORE_CASE)

    val FEATURES = words(
        """vault focus budget emergency money family score notes journal settings calendar tasks minimums goals patterns battery backup account privacy help subscription""",
    ) + setOf("screen time", "weekly review", "emergency card", "recent captures", "money inbox", "life score", "screen-time", "plan my day")

    /** Spoken hesitations and openers dropped before any parsing ("um", "so i"). */
    val SPOKEN_FILLERS = Regex("""^(?:(?:uh+|um+|umm+|er+|hmm+|so|like|okay|ok|well|basically|actually|please|can you|could you)\s+)+""", RegexOption.IGNORE_CASE)
    val LEADING_FILLERS = Regex("""^(?:(?:uh+|um+|er+|hmm+|so|like|okay|ok|well|basically|actually|please|can you|could you|i|we|add|log|create|and|then|also|phir|aur)\s+)+""", RegexOption.IGNORE_CASE)
    val INLINE_FILLERS = Regex("""\b(?:uh+|um+|er+|hmm+|like|basically|actually|you know)\b""", RegexOption.IGNORE_CASE)

    /** Words dropped from labels anywhere in the phrase. */
    val LABEL_STOP = SPEND_VERBS + INCOME_CUES + words(
        """rupees rs inr usd aud cad eur gbp aed sgd jpy dollar dollars bucks euro euros pound pounds quid dirham dirhams yen only approx approximately around about maine mujhe i
        paise paisa remind me need have dont forget not""",
    ) - setOf("split", "cost", "costs", "tea", "income", "interest", "bonus", "refund", "salary", "cashback", "gas", "water", "food", "get", "return", "sent", "book", "order", "pay", "buy")
    /** Prepositions and joiners trimmed from the ends of a label. */
    val LABEL_EDGE = words("for on at to ko ka ki ke pe me se ne of the a an and aur with in by tak hai h ho hoga tha thi ya then phir by per from")

    fun category(words: List<String>, text: String): String? {
        val w = words.toSet()
        fun any(vararg s: String) = s.any { it in w || text.contains(it) && it.contains(' ') }
        return when {
            any("swiggy", "zomato", "food", "dinner", "lunch", "breakfast", "brunch", "cafe", "coffee", "chai", "tea", "restaurant", "pizza", "burger", "biryani", "snack", "snacks", "khana", "nashta", "thali", "dosa", "idli", "samosa", "juice", "dominos", "starbucks", "tiffin", "maggi", "paratha", "paan", "popcorn", "ice cream") -> "Food"
            any("groceries", "grocery", "vegetables", "veggies", "sabzi", "fruits", "milk", "doodh", "curd", "eggs", "bread", "atta", "dal", "rice", "ration", "kirana", "provisions", "bigbasket", "blinkit", "zepto", "dmart", "supermarket") -> "Grocery"
            any("petrol", "diesel", "fuel", "cng", "metro", "uber", "ola", "rapido", "cab", "taxi", "auto", "rickshaw", "bus", "parking", "toll", "fastag", "bike", "scooter", "car") -> "Transport"
            any("flight", "flights", "train", "hotel", "hostel", "trip", "travel", "stay") -> "Travel"
            any("rent", "kiraya") -> "Rent"
            any("netflix", "prime", "hotstar", "spotify", "subscription") -> "Subs"
            any("electricity", "bijli", "wifi", "broadband", "internet", "recharge", "dth", "gas", "cylinder", "water", "bill", "bills", "maid", "emi", "loan", "insurance", "premium", "lic", "tax") -> "Bills"
            any("medicine", "medicines", "dawai", "dawa", "doctor", "consultation", "pharmacy", "hospital", "dentist", "checkup", "lab", "gym", "yoga") -> "Health"
            any("fees", "fee", "tuition", "school", "college", "course", "class", "coaching", "books", "book", "stationery") -> "Education"
            any("movie", "movies", "concert") -> "Fun"
            any("gift", "gifts", "flowers", "flower", "donation", "charity", "temple", "pooja", "puja") -> "Gifts"
            any("shopping", "clothes", "shirt", "shirts", "jeans", "shoes", "shoe", "bag", "watch", "phone", "mobile", "laptop", "charger", "amazon", "flipkart", "myntra", "meesho", "toy", "toys") -> "Shopping"
            any("salon", "haircut", "barber", "spa", "laundry") -> "Family"
            else -> null
        }
    }
}
