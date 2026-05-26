import { useState } from 'react'
import { Clock, ChevronDown, X, Search, ExternalLink } from 'lucide-react'
import './HealthArticles.css'

const CATEGORIES = ['All', 'Awareness', 'Hygiene', 'Nutrition', 'Wellness', 'Health']

const sections = [
  {
    category: 'Awareness',
    color: '#c2185b',
    browseUrl: 'https://www.mayoclinic.org/healthy-lifestyle/womens-health',
    browseLabel: 'Mayo Clinic',
    articles: [
      {
        id: 1,
        title: 'Understanding Your Menstrual Cycle',
        desc: 'A complete guide to the four phases of your cycle and what is considered normal.',
        readTime: '5 min read',
        content: {
          intro: 'The menstrual cycle is a monthly series of hormonal changes that prepare the body for pregnancy. A typical cycle lasts 21–35 days, with menstruation lasting 2–7 days.',
          sections: [
            { title: 'Phase 1 — Menstruation (Days 1–5)', text: 'Your period begins when the uterine lining sheds. Cramping, bloating, and fatigue are common. Flow typically lasts 3–7 days. Day 1 of bleeding is day 1 of your new cycle.' },
            { title: 'Phase 2 — Follicular Phase (Days 1–13)', text: 'Estrogen rises, the uterine lining thickens, and a follicle matures. Energy levels increase and mood generally improves. This phase overlaps with menstruation and ends at ovulation.' },
            { title: 'Phase 3 — Ovulation (Around Day 14)', text: 'A mature egg is released — your peak fertility window. Signs include clear stretchy discharge, a slight rise in basal body temperature, and mild one-sided pelvic cramping.' },
            { title: 'Phase 4 — Luteal Phase (Days 15–28)', text: 'Progesterone rises to support possible pregnancy. If no fertilisation occurs, levels fall and menstruation begins. PMS symptoms — bloating, mood changes, breast tenderness — appear here.' },
            { title: 'When Your Cycle Is Irregular', text: 'Cycles consistently shorter than 21 days or longer than 35 days, very heavy bleeding, or periods lasting more than 7 days may indicate a hormonal imbalance and warrant a doctor\'s review.' },
          ],
        },
      },
      {
        id: 2,
        title: 'What Is a Normal Period?',
        desc: 'Flow volume, colour, duration — what the science actually says is normal.',
        readTime: '4 min read',
        content: {
          intro: 'There is a wide spectrum of what counts as a "normal" period. Understanding the range helps you recognise when something may need attention.',
          sections: [
            { title: 'Flow Volume', text: 'A typical period involves losing 30–80 ml of blood. Soaking a pad or tampon every hour for several consecutive hours is considered heavy and warrants investigation.' },
            { title: 'Colour', text: 'Period blood can range from bright red to dark brown or even near-black. Darker blood is simply older blood that has taken longer to exit the uterus — this is completely normal.' },
            { title: 'Clots', text: 'Small clots (smaller than a 50p coin) are normal, especially on heavier flow days. Consistently large clots may indicate fibroids, adenomyosis, or a clotting disorder.' },
            { title: 'Cycle Length Variation', text: 'Your cycle length may vary by a few days from month to month. Stress, illness, travel, and significant weight changes can all shift your cycle temporarily.' },
          ],
        },
      },
      {
        id: 3,
        title: 'Tracking Your Cycle — Why It Matters',
        desc: 'How logging your period data helps you understand your health patterns.',
        readTime: '3 min read',
        content: {
          intro: 'Tracking your menstrual cycle gives you data-driven insight into your body. Over time, patterns emerge that can help you anticipate symptoms, optimise productivity, and spot health changes early.',
          sections: [
            { title: 'What to Track', text: 'Start date and end date of each period, flow intensity (spotting/light/medium/heavy), physical symptoms (cramps, bloating, fatigue), and mood and energy levels each day.' },
            { title: 'How Long Before Patterns Emerge', text: 'After logging 3–4 cycles, clear patterns become visible. You\'ll know your average cycle length, expected PMS window, and which days tend to be heaviest.' },
            { title: 'When Tracking Reveals a Problem', text: 'Consistently irregular cycles, worsening symptoms, or sudden changes in your pattern are signals your tracker will surface — giving you concrete information to share with a doctor.' },
          ],
        },
      },
      {
        id: 16,
        title: 'Hormones 101: Estrogen & Progesterone',
        desc: 'Roles, cycle-wide changes, and how they correlate with your mood, skin, and energy.',
        readTime: '5 min read',
        content: {
          intro: 'Estrogen and progesterone are the primary female sex hormones that regulate the reproductive system. Their levels rise and fall in a tightly orchestrated dance throughout your menstrual cycle, affecting not just your uterus but your entire body.',
          sections: [
            { title: 'Estrogen: The Energy Booster', text: 'Estrogen dominates the first half of your cycle. It supports bone health, cholesterol levels, and triggers the growth of the uterine lining. High estrogen increases serotonin levels, leading to higher energy, brighter mood, and clearer skin during the follicular phase.' },
            { title: 'Progesterone: The Calming Agent', text: 'Produced after ovulation, progesterone dominates the luteal phase. It maintains the uterine lining for possible pregnancy. Progesterone has a natural calming, sedative effect, but sharp drops right before your period can trigger PMS symptoms, anxiety, and sleep problems.' },
            { title: 'The Estrogen-Progesterone Balance', text: 'A healthy cycle relies on the correct ratio of these two hormones. Estrogen dominance — where estrogen is high relative to progesterone — can lead to heavy periods, severe cramps, breast tenderness, and mood swings.' }
          ]
        }
      },
      {
        id: 17,
        title: 'Puberty & Menarche: The First Period',
        desc: 'A guidance tool for adolescents and parents on what to expect and normal early irregularities.',
        readTime: '6 min read',
        content: {
          intro: 'Menarche — the first menstrual period — is a major developmental milestone in puberty, typically occurring between ages 10 and 15. Understanding what is normal during these early years can ease anxiety for teens and parents alike.',
          sections: [
            { title: 'What is Menarche?', text: 'Menarche marks the activation of the hypothalamic-pituitary-ovarian axis. It is preceded by other signs of puberty, such as breast development (thelarche) and hair growth, usually starting 2 years before.' },
            { title: 'Early Cycle Irregularity is Normal', text: 'In the first 1–3 years after menarche, cycles are frequently anovulatory (no egg is released). This leads to highly irregular periods, ranging from brief spotting to long cycles of several months. The body is simply fine-tuning its hormonal feedback loops.' },
            { title: 'Essential Tips for Teen Care', text: 'Teens should learn how to track their periods, carry backup supplies, and practice good hygiene. Open, positive conversations help remove the stigma and make adolescents comfortable asking questions about their bodies.' }
          ]
        }
      }
    ],
  },
  {
    category: 'Hygiene',
    color: '#1565c0',
    browseUrl: 'https://www.healthline.com/health/womens-health',
    browseLabel: 'Healthline',
    articles: [
      {
        id: 4,
        title: 'Menstrual Hygiene — Best Practices',
        desc: 'How to stay clean, comfortable, and infection-free throughout your period.',
        readTime: '4 min read',
        content: {
          intro: 'Good menstrual hygiene prevents infections, odour, and skin irritation. Consistent habits — changing products on time and washing correctly — make a significant difference.',
          sections: [
            { title: 'Change Products Regularly', text: 'Pads should be changed every 4–6 hours; tampons every 4–8 hours and never longer than 8 hours. Prolonged use risks bacterial growth and, for tampons, Toxic Shock Syndrome (TSS).' },
            { title: 'Wash Gently', text: 'Rinse the external area with warm water and mild unscented soap. Avoid douching — the vagina is self-cleaning and douching disrupts its natural bacterial balance.' },
            { title: 'Clothing & Disposal', text: 'Wear breathable cotton underwear. Wrap used products before disposal. Never flush pads, tampons, or wipes — they block pipes and cause environmental harm.' },
          ],
        },
      },
      {
        id: 5,
        title: 'Choosing the Right Menstrual Product',
        desc: 'Pads, tampons, cups, discs — how to find what works for your body and lifestyle.',
        readTime: '5 min read',
        content: {
          intro: 'No single product suits everyone. Understanding the options helps you make an informed choice based on your flow, lifestyle, and comfort level.',
          sections: [
            { title: 'Pads & Liners', text: 'Easy to use and widely available. Best for lighter days or as backup for other products. Modern ultra-thin designs are discreet. Change every 4–6 hours to prevent odour and rash.' },
            { title: 'Tampons', text: 'Inserted internally; allow swimming and active lifestyles. Use the lowest absorbency for your flow. Change every 4–8 hours. Never leave in for more than 8 hours due to TSS risk.' },
            { title: 'Menstrual Cups & Discs', text: 'Reusable silicone cups collect rather than absorb flow. Last up to 12 hours and can be used for years, reducing waste and cost. Learning curve to insert correctly but highly effective.' },
            { title: 'Period Underwear', text: 'Absorbent underwear that replaces disposable products. Works well for light to moderate flow. Machine washable and reusable. Ideal as standalone or backup protection.' },
          ],
        },
      },
      {
        id: 6,
        title: 'Preventing Infections During Your Period',
        desc: 'Practical steps to reduce the risk of UTIs, BV, and yeast infections.',
        readTime: '4 min read',
        content: {
          intro: 'The hormonal changes during menstruation can alter vaginal pH, making infections slightly more likely. Simple hygiene habits significantly reduce this risk.',
          sections: [
            { title: 'Bacterial Vaginosis (BV)', text: 'Caused by an overgrowth of naturally occurring bacteria. Symptoms include grey discharge and a fishy odour. Triggered by douching, new sexual partners, or antibiotics. Treated with antibiotics from a doctor.' },
            { title: 'Yeast Infections', text: 'Hormonal shifts before and during the period alter pH, encouraging yeast overgrowth. Symptoms include itching, thick white discharge, and irritation. Treated with antifungal cream or oral fluconazole.' },
            { title: 'UTI Prevention', text: 'Always wipe front to back. Change pads and tampons frequently. Stay well hydrated. Urinate after sexual activity. Cotton underwear reduces moisture that bacteria thrive in.' },
          ],
        },
      },
      {
        id: 18,
        title: 'Eco-Friendly Menstrual Products',
        desc: 'The environmental and economic benefits of reusable pads, cups, discs, and period pants.',
        readTime: '5 min read',
        content: {
          intro: 'Traditional disposable pads and tampons generate significant plastic waste and represent a recurring lifetime expense. Modern reusable alternatives offer eco-friendly, cost-effective, and comfortable solutions.',
          sections: [
            { title: 'The Environmental Impact of Disposables', text: 'An average person uses 11,000–16,000 disposable products in their lifetime. These contain up to 90% plastic, taking hundreds of years to decompose. Reusable alternatives drastically minimize landfill waste and carbon footprint.' },
            { title: 'Reusable Pads & Period Underwear', text: 'Reusable cloth pads snap onto standard underwear, while period underwear has built-in absorbent layers. Both are made of breathable, moisture-wicking fabrics and can be washed and reused for 2–5 years, saving thousands of single-use plastics.' },
            { title: 'Menstrual Cups & Discs', text: 'Made of medical-grade silicone, these collection devices are inserted internally. A single cup can last up to 10 years, collects more flow than tampons, and preserves the natural moisture and vaginal microbiome without drying.' }
          ]
        }
      },
      {
        id: 19,
        title: 'Intimate Care: pH Balance & Washing Tips',
        desc: 'Guide to maintaining vaginal health, products to avoid, and wearing breathable fabrics.',
        readTime: '4 min read',
        content: {
          intro: 'Intimate hygiene is critical to prevent bacterial and yeast overgrowth. Maintaining the vagina\'s natural acidic pH balance is the key to preventing irritation and infections.',
          sections: [
            { title: 'Understanding Vaginal pH', text: 'A healthy vagina has an acidic pH of 3.8 to 4.5. This acidity is maintained by beneficial Lactobacilli bacteria, which produce lactic acid to keep harmful pathogens from multiplying.' },
            { title: 'Avoid Harms: Ditch Fragrances & Douching', text: 'The vagina is a self-cleaning organ; internal douching is unnecessary and dangerous. Avoid scented body washes, bubble baths, and vaginal deodorants, as they disrupt pH, cause chemical irritation, and lead to BV or yeast infections.' },
            { title: 'Breathable Fabrics & Daily Habits', text: 'Wear loose-fitting cotton underwear to prevent moisture buildup. Avoid staying in damp workout gear or wet swimsuits. During your period, dry the vulva thoroughly after washing and always wipe front to back.' }
          ]
        }
      }
    ],
  },
  {
    category: 'Nutrition',
    color: '#2e7d32',
    browseUrl: 'https://www.healthline.com/nutrition',
    browseLabel: 'Healthline Nutrition',
    articles: [
      {
        id: 7,
        title: 'Nutrition for Menstrual Health',
        desc: 'What to eat and avoid during your cycle to reduce cramps, bloating, and fatigue.',
        readTime: '6 min read',
        content: {
          intro: 'Diet directly influences how you experience your period. Anti-inflammatory foods lower prostaglandin levels — the compounds responsible for cramping — while specific nutrients stabilise mood and sustain energy.',
          sections: [
            { title: 'Magnesium — the Muscle Relaxant', text: 'Magnesium relaxes uterine muscles and reduces cramp intensity. Best sources: dark chocolate (70%+), almonds, pumpkin seeds, spinach, and avocados. Recommended daily intake: 310–320 mg.' },
            { title: 'Omega-3 Fatty Acids', text: 'Omega-3s reduce prostaglandin production, directly lowering cramp severity. Rich sources: salmon, sardines, mackerel, walnuts, flaxseeds, and chia seeds.' },
            { title: 'Iron & Vitamin C', text: 'Heavy periods cause significant iron loss leading to fatigue. Replenish with spinach, lentils, lean meat, and fortified cereals. Pair with vitamin C to enhance absorption.' },
            { title: 'Foods & Drinks to Limit', text: 'Excess salt worsens bloating. Caffeine amplifies cramping. Alcohol increases inflammation. Refined sugar causes energy crashes that worsen mood instability.' },
          ],
        },
      },
      {
        id: 8,
        title: 'Supplements That May Help Period Symptoms',
        desc: 'Evidence-based supplements for cramps, mood, and hormonal balance.',
        readTime: '5 min read',
        content: {
          intro: 'While diet is the foundation, certain supplements have clinical evidence supporting their role in reducing menstrual symptoms. Always consult a doctor before starting any new supplement.',
          sections: [
            { title: 'Magnesium Glycinate', text: 'Most bioavailable form of magnesium. Studies show 250–350 mg/day reduces cramp severity and PMS mood symptoms. Also improves sleep quality during the luteal phase.' },
            { title: 'Vitamin D', text: 'Deficiency is strongly linked to painful periods. Vitamin D regulates prostaglandin synthesis. A daily dose of 1000–2000 IU is commonly recommended, adjusted based on blood levels.' },
            { title: 'Vitamin B6', text: 'Supports serotonin and dopamine production, helping stabilise mood during PMS. 50–100 mg/day in the luteal phase has shown benefit in clinical trials.' },
            { title: 'Omega-3 Fish Oil', text: '1–2g of EPA/DHA daily has been shown in multiple studies to reduce dysmenorrhea (painful periods) comparably to ibuprofen in some participants.' },
          ],
        },
      },
      {
        id: 9,
        title: 'Hydration & Herbal Teas for Your Cycle',
        desc: 'The best drinks to ease cramps, reduce bloating, and support hormone balance.',
        readTime: '3 min read',
        content: {
          intro: 'Staying hydrated reduces muscle cramps and bloating. Certain herbal teas have evidence-backed anti-inflammatory and antispasmodic properties that directly ease period symptoms.',
          sections: [
            { title: 'Ginger Tea', text: 'Ginger inhibits prostaglandin synthesis — the same mechanism as NSAIDs. Brew 1–2 inches of fresh ginger in boiling water for 10 minutes. Effective for cramps and nausea.' },
            { title: 'Chamomile Tea', text: 'Contains apigenin and glycine, compounds that relax uterine muscle spasms. Anti-inflammatory properties also reduce bloating. Drink 2–3 cups daily during your period.' },
            { title: 'Peppermint Tea', text: 'Menthol has antispasmodic properties that relieve bowel and uterine cramps. Also reduces the nausea that some experience with heavy cramping.' },
          ],
        },
      },
      {
        id: 20,
        title: 'Seed Cycling for Hormonal Balance',
        desc: 'How using seeds across your cycle phases can support estrogen and progesterone levels.',
        readTime: '5 min read',
        content: {
          intro: 'Seed cycling is a natural nutritional practice that involves eating specific seeds at different times in your menstrual cycle to support balanced hormone production.',
          sections: [
            { title: 'The Follicular Phase (Days 1–14)', text: 'Consume 1 tablespoon each of raw, freshly ground flaxseeds and pumpkin seeds daily. Flax contains lignans that bind excess estrogen, while pumpkin seeds are high in zinc, supporting healthy follicle development and estrogen production.' },
            { title: 'The Luteal Phase (Days 15–28)', text: 'Consume 1 tablespoon each of raw, freshly ground sesame seeds and sunflower seeds daily. Sesame is rich in lignans and calcium, while sunflower seeds are high in selenium and vitamin E, supporting progesterone synthesis and liver detoxification.' },
            { title: 'Consistency & Results', text: 'While seed cycling is not a medical cure, many report reductions in PMS and cramps after 3 months of consistent use. Incorporate seeds easily into smoothies, oatmeal, yogurt, or salads.' }
          ]
        }
      },
      {
        id: 21,
        title: 'Managing Period Cravings & Blood Sugar',
        desc: 'Understanding luteal phase cravings and using complex carbs and proteins to stabilize energy.',
        readTime: '4 min read',
        content: {
          intro: 'It is highly common to experience intense cravings for sweets, carbs, and fats in the days leading up to your period. Understanding the biological triggers helps you manage these cravings without energy crashes.',
          sections: [
            { title: 'Why Cravings Happen', text: 'During the luteal phase, rising progesterone boosts your metabolic rate, causing your body to burn more calories and demand more energy. Simultaneously, falling estrogen lowers serotonin levels, triggering cravings for quick carbohydrate fixes.' },
            { title: 'Stabilizing Blood Sugar', text: 'Avoid refined sugars, which cause rapid spikes and crashes, worsening mood swings and fatigue. Instead, focus on complex carbohydrates (oatmeal, sweet potatoes, quinoa) paired with lean protein and healthy fats to maintain steady glucose levels.' },
            { title: 'Healthy Alternatives', text: 'Satisfy sweet cravings with 70%+ dark chocolate (rich in magnesium) or fruit. Ensure you eat regular, balanced meals to prevent extreme hunger, which amplifies premenstrual cravings.' }
          ]
        }
      }
    ],
  },
  {
    category: 'Wellness',
    color: '#6a1b9a',
    browseUrl: 'https://www.healthline.com/health/womens-health/pms',
    browseLabel: 'Healthline',
    articles: [
      {
        id: 10,
        title: 'Mental Health & the Menstrual Cycle',
        desc: 'How hormonal fluctuations affect mood, anxiety, and emotional wellbeing.',
        readTime: '5 min read',
        content: {
          intro: 'Hormonal shifts across the menstrual cycle measurably affect neurotransmitter activity — particularly serotonin and dopamine. This explains why mood and emotional regulation often feel different depending on cycle phase.',
          sections: [
            { title: 'Premenstrual Syndrome (PMS)', text: 'PMS affects up to 75% of menstruating people. Irritability, low mood, bloating, and fatigue typically begin 1–2 weeks before the period. Caused by falling estrogen and progesterone.' },
            { title: 'PMDD — Severe PMS', text: 'PMDD affects 3–8% of people. Symptoms are debilitating — severe depression, intense anxiety, hopelessness — severe enough to disrupt work and relationships. A recognised medical condition with effective treatments.' },
            { title: 'Evidence-Based Coping', text: 'Tracking mood alongside your cycle reveals patterns. Regular aerobic exercise, consistent sleep (7–9 hrs), CBT, and reducing caffeine all show clinical benefit for PMS and PMDD symptoms.' },
          ],
        },
      },
      {
        id: 11,
        title: 'Exercise & Your Menstrual Cycle',
        desc: 'How to adapt your training across the four phases for better performance and less pain.',
        readTime: '5 min read',
        content: {
          intro: 'Your hormonal profile changes significantly across the cycle, affecting strength, endurance, recovery, and pain tolerance. Adapting your training accordingly is backed by growing sports science research.',
          sections: [
            { title: 'Menstrual Phase — Rest & Restore', text: 'Energy and iron levels are lower. Focus on gentle movement: walking, yoga, light swimming. Avoid pushing to exhaustion. Your body is doing significant physiological work.' },
            { title: 'Follicular Phase — Peak Performance', text: 'Rising estrogen improves strength, coordination, and pain tolerance. This is your best window for high-intensity training, heavy lifting, and personal bests.' },
            { title: 'Luteal Phase — Moderate & Manage', text: 'Progesterone increases body temperature and perceived effort. Reduce intensity by 10–15%. Prioritise recovery. Watch for increased injury risk — ligament laxity rises in this phase.' },
          ],
        },
      },
      {
        id: 12,
        title: 'Sleep & Your Cycle',
        desc: 'Why your sleep quality fluctuates throughout the month and what to do about it.',
        readTime: '4 min read',
        content: {
          intro: 'Sleep quality, duration, and architecture shift measurably across the menstrual cycle. Progesterone has sedative properties, while pre-menstrual estrogen and temperature drops fragment sleep.',
          sections: [
            { title: 'Luteal Phase Sleep Disruption', text: 'In the week before your period, falling estrogen disrupts serotonin and melatonin production, causing lighter, more fragmented sleep. Core body temperature also rises, further reducing sleep depth.' },
            { title: 'Best Sleep Positions During Your Period', text: 'The foetal position (side-lying, knees drawn up) reduces abdominal pressure and eases cramping. Placing a pillow between your knees improves hip alignment and further reduces pelvic discomfort.' },
            { title: 'Improving Luteal Phase Sleep', text: 'Keep your bedroom cooler than usual (17–19°C). Avoid screens 90 minutes before bed. Magnesium glycinate 200–350 mg before sleep shows benefit in clinical trials for PMS-related insomnia.' },
          ],
        },
      },
      {
        id: 22,
        title: 'Stress Management & Menstruation',
        desc: 'How cortisol delays or stops your period and simple breathing techniques to recover.',
        readTime: '5 min read',
        content: {
          intro: 'High stress levels trigger the release of cortisol, a hormone that can disrupt the delicate brain signals that govern your menstrual cycle, leading to late or completely missed periods.',
          sections: [
            { title: 'The Cortisol Connection', text: 'Chronic stress activates the hypothalamic-pituitary-adrenal (HPA) axis. Elevated cortisol levels signal to the brain that the body is under threat, causing it to suppress the secretion of GnRH, which stops ovulation (hypothalamic amenorrhea).' },
            { title: 'Impacts on Flow & Cycle Length', text: 'Stress can either delay ovulation, resulting in a late period, or cause you to skip your cycle altogether. When a period does arrive under high stress, it is often accompanied by worse cramps and mood shifts.' },
            { title: 'Simple Mindfulness Techniques', text: 'Practice 4-7-8 breathing or box breathing (inhale for 4s, hold for 4s, exhale for 4s, hold for 4s) daily to stimulate the vagus nerve and reduce heart rate, signaling safety to your reproductive system.' }
          ]
        }
      },
      {
        id: 23,
        title: 'Cycle Syncing: Aligning Life with Your Cycle',
        desc: 'Concept of adjusting productivity, work tasks, and social schedules based on your phase.',
        readTime: '6 min read',
        content: {
          intro: 'Cycle syncing is the practice of aligning your career, social calendar, nutrition, and exercise with the four phases of your menstrual cycle, allowing you to work with your body instead of against it.',
          sections: [
            { title: 'Follicular & Ovulatory Phases: High Social & Creative Output', text: 'As estrogen rises, you feel confident, expressive, and energized. This is the optimal window for launching new projects, public speaking, job interviews, networking, and intense social planning.' },
            { title: 'Luteal Phase: Focus & Organization', text: 'As progesterone rises, energy begins to wind down, but analytical focus increases. This phase is perfect for detail-oriented tasks, editing, organizing files, reviewing budgets, and enjoying smaller, cozy social gatherings.' },
            { title: 'Menstrual Phase: Reflection & Restoration', text: 'With all hormones at their lowest, your body requires rest. Use this time for reflection, assessing what is working in your life, journaling, deep planning, and prioritizing restful sleep and solo activities.' }
          ]
        }
      }
    ],
  },
  {
    category: 'Health',
    color: '#b71c1c',
    browseUrl: 'https://www.nhs.uk/conditions/periods/',
    browseLabel: 'NHS',
    articles: [
      {
        id: 13,
        title: 'When to See a Doctor About Your Period',
        desc: 'Red flag symptoms that require prompt medical attention.',
        readTime: '4 min read',
        content: {
          intro: 'Most period symptoms are normal. However, certain signs indicate underlying medical conditions — endometriosis, fibroids, or hormonal disorders — that require prompt assessment.',
          sections: [
            { title: 'Heavy or Prolonged Bleeding', text: 'Soaking through a pad or tampon every hour for several hours, passing large clots, or periods lasting more than 7 days constitutes heavy menstrual bleeding (menorrhagia). Causes include fibroids, polyps, or clotting disorders.' },
            { title: 'Severe or Worsening Cramps', text: 'Cramps not relieved by OTC medication, or that worsen over time, may indicate endometriosis. Progressive pelvic pain that interferes with daily life warrants specialist evaluation.' },
            { title: 'Irregular or Absent Periods', text: 'Missing three or more consecutive periods (when not pregnant) requires investigation. Causes include PCOS, thyroid dysfunction, or excessive exercise-related suppression.' },
            { title: 'Pelvic Pain & Unusual Discharge', text: 'Chronic pelvic pain, pain during intercourse, or discharge with an unusual colour or odour may indicate pelvic inflammatory disease, endometriosis, or infection. Don\'t ignore these.' },
          ],
        },
      },
      {
        id: 14,
        title: 'PCOS — Polycystic Ovary Syndrome',
        desc: 'Understanding PCOS, its impact on your cycle, and evidence-based management.',
        readTime: '7 min read',
        content: {
          intro: 'PCOS is a common hormonal condition affecting approximately 1 in 10 people with ovaries. It is characterised by elevated androgen levels, irregular ovulation, and often the presence of multiple small ovarian follicles.',
          sections: [
            { title: 'Core Hormonal Mechanism', text: 'The ovaries produce excess androgens, disrupting normal follicle maturation and preventing regular ovulation. Insulin resistance, present in up to 70% of cases, further amplifies androgen production.' },
            { title: 'Clinical Symptoms', text: 'Irregular or absent periods; excess facial and body hair (hirsutism); acne along the jawline; scalp hair thinning; weight gain around the abdomen; and difficulty conceiving.' },
            { title: 'Lifestyle Management', text: 'A 5–10% reduction in body weight significantly improves insulin sensitivity and restores more regular ovulation. A low-GI diet and 150 minutes of moderate aerobic exercise weekly are first-line recommendations.' },
            { title: 'Medical Treatment', text: 'Combined oral contraceptives regulate periods and lower androgens. Metformin improves insulin sensitivity. For those trying to conceive, letrozole or clomifene stimulate ovulation.' },
          ],
        },
      },
      {
        id: 15,
        title: 'Endometriosis — Explained',
        desc: 'Symptoms, diagnosis, and treatment of one of the most under-diagnosed conditions.',
        readTime: '6 min read',
        content: {
          intro: 'Endometriosis affects approximately 1 in 10 people with a uterus. Tissue similar to the uterine lining grows outside the uterus — on the ovaries, fallopian tubes, and peritoneum — causing inflammation, scarring, and significant pain.',
          sections: [
            { title: 'Core Symptoms', text: 'Severe dysmenorrhea (painful periods) that worsens over time, chronic pelvic pain, pain during or after sex, painful urination or bowel movements during menstruation, and heavy bleeding.' },
            { title: 'Why Diagnosis Takes So Long', text: 'The average time from symptom onset to diagnosis is 7–10 years. Symptoms are often dismissed as "normal" period pain. Definitive diagnosis requires laparoscopy — a surgical procedure.' },
            { title: 'Treatment Options', text: 'Hormonal therapy (combined pill, progestins, GnRH agonists) suppresses the growth of endometrial tissue. Laparoscopic surgery can remove lesions. There is no cure, but symptoms can be managed effectively.' },
            { title: 'Impact on Fertility', text: 'Endometriosis affects fertility in approximately 30–50% of those with the condition, due to adhesions and inflammation affecting egg quality and tubal function. Early diagnosis improves fertility outcomes.' },
          ],
        },
      },
      {
        id: 24,
        title: 'Adenomyosis: The Sister of Endometriosis',
        desc: 'Explanation of adenomyosis, how it differs from endometriosis, symptoms, and care.',
        readTime: '6 min read',
        content: {
          intro: 'Adenomyosis is a common condition where the endometrial tissue that normally lines the uterus grows into the muscular wall of the uterus, leading to severe uterine enlargement and painful bleeding.',
          sections: [
            { title: 'How It Differs from Endometriosis', text: 'While endometriosis involves endometrial-like tissue growing *outside* the uterus, adenomyosis is strictly contained *inside* the muscular wall of the uterus (the myometrium), causing the uterus to double or triple in size.' },
            { title: 'Clinical Symptoms', text: 'Heavy, prolonged bleeding (menorrhagia), severe menstrual cramps (dysmenorrhea), chronic pelvic pain, and painful intercourse. Many experience a sensation of abdominal pressure or bloating.' },
            { title: 'Diagnosis & Treatment Options', text: 'Adenomyosis is diagnosed via pelvic ultrasound or MRI. Treatments include hormonal therapies (such as the levonorgestrel IUD or oral contraceptives) to reduce bleeding, or a hysterectomy as a definitive cure for those who have finished childbearing.' }
          ]
        }
      },
      {
        id: 25,
        title: 'Thyroid Health & Menstrual Irregularity',
        desc: 'Understanding how thyroid disorders affect cycles, flow volume, and hormonal signaling.',
        readTime: '5 min read',
        content: {
          intro: 'The thyroid gland regulates metabolism, and its hormones directly interact with your ovaries. Dysfunction in the thyroid — whether producing too much or too little hormone — is a leading cause of irregular menstrual cycles.',
          sections: [
            { title: 'Hypothyroidism: Underactive Thyroid', text: 'When the thyroid is underactive, cycles may become very heavy (menorrhagia), highly irregular, or more frequent. Severe hypothyroidism can disrupt ovulation entirely, causing fertility challenges and low libido.' },
            { title: 'Hyperthyroidism: Overactive Thyroid', text: 'An overactive thyroid gland speed up body processes. This can lead to extremely light periods (hypomenorrhea), missed periods (amenorrhea), or cycles that are unusually long and spaced out.' },
            { title: 'Diagnosis & Balance', text: 'Thyroid dysfunction is easily diagnosed through a simple blood test measuring Thyroid-Stimulating Hormone (TSH). Daily thyroid hormone replacement or antithyroid medications can normalize cycle patterns rapidly.' }
          ]
        }
      }
    ],
  },
]

// Flatten all articles for search/filter
const allArticles = sections.flatMap((s) =>
  s.articles.map((a) => ({ ...a, category: s.category, color: s.color, browseUrl: s.browseUrl, browseLabel: s.browseLabel }))
)


export default function HealthArticles() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState(null)
  const [activeModalArticle, setActiveModalArticle] = useState(null)

  const handleOpenModal = (article) => {
    setActiveModalArticle(article)
  }

  const handleCloseModal = () => {
    setActiveModalArticle(null)
  }

  const isFiltered = activeCategory !== 'All' || search.trim() !== ''

  // Filtered flat list
  const filteredFlat = allArticles.filter((a) => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.desc.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  // Grouped by section (only when not filtered)
  const visibleSections = sections
    .map((s) => ({
      ...s,
      articles: s.articles.filter((a) => {
        const matchCat = activeCategory === 'All' || s.category === activeCategory
        const matchSearch =
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.desc.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
      }),
    }))
    .filter((s) => s.articles.length > 0)

  return (
    <div className="ha-wrap">

      {/* Header */}
      <div className="ha-header">
        <h1 className="ha-title">Health Articles</h1>
        <p className="ha-sub">Women's health awareness, wellness &amp; education</p>
      </div>

      {/* Search */}
      <div className="ha-search-wrap">
        <Search size={15} className="ha-search-icon" />
        <input
          className="ha-search"
          type="text"
          placeholder="Search articles…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Filters */}
      <div className="ha-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`ha-filter-btn ${activeCategory === cat ? 'ha-filter-active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>


      {/* Article Sections */}
      {visibleSections.length > 0 ? visibleSections.map((sec) => (
        <div key={sec.category} className="ha-section">

          {/* Section Label */}
          <div className="ha-section-label" style={{ '--sec-color': sec.color }}>
            <span className="ha-section-name">{sec.category}</span>
          </div>

          {/* Article List — premium styling */}
          <div className="ha-list">
            {sec.articles.map((a) => {
              const isOpen = openId === a.id
              return (
                <div
                  key={a.id}
                  className={`ha-article-card ${isOpen ? 'ha-article-open' : ''}`}
                  style={{ '--art-color': sec.color }}
                >
                  {/* Article Header */}
                  <div
                    className="ha-article-header"
                    onClick={() => setOpenId(isOpen ? null : a.id)}
                  >
                    <div className="ha-article-left">
                      <div className="ha-art-meta">
                        <span className="ha-category-tag" style={{ color: sec.color }}>
                          {sec.category}
                        </span>
                        <span className="ha-dot">•</span>
                        <span className="ha-read-time">
                          <Clock size={11} /> {a.readTime}
                        </span>
                        <span className="ha-dot">•</span>
                        <span className="ha-source-label">via {sec.browseLabel}</span>
                      </div>
                      <h3 className="ha-article-title">{a.title}</h3>
                      <p className="ha-article-desc">{a.desc}</p>
                    </div>
                    <div className={`ha-chevron ${isOpen ? 'ha-chevron-open' : ''}`}>
                      <ChevronDown size={16} />
                    </div>
                  </div>

                  {/* Expanded Article Content */}
                  {isOpen && (
                    <div className="ha-article-body">
                      <p className="ha-art-intro">{a.content.intro}</p>
                      {a.content.sections.map((s, si) => (
                        <div key={si} className="ha-art-section">
                          <h4 className="ha-art-section-title">{s.title}</h4>
                          <p className="ha-art-section-text">{s.text}</p>
                        </div>
                      ))}
                      <div className="ha-art-actions">
                        <button
                          className="ha-read-full-btn"
                          onClick={() => handleOpenModal({
                            ...a,
                            category: sec.category,
                            color: sec.color,
                            browseUrl: sec.browseUrl,
                            browseLabel: sec.browseLabel
                          })}
                        >
                          Read Full Article
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Browse More Link */}
          <a
            href={sec.browseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ha-browse-link"
            style={{ '--sec-color': sec.color }}
          >
            Browse more on {sec.browseLabel}
            <ExternalLink size={12} />
          </a>

        </div>
      )) : (
        <div className="ha-empty">
          <span className="ha-empty-icon">❀</span>
          <h3>No articles found</h3>
          <p>Try adjusting your search or filter.</p>
        </div>
      )}

      {/* Full Immersive Article Modal */}
      {activeModalArticle && (
        <>
          <div className="ha-modal-backdrop" onClick={handleCloseModal} />
          <div className="ha-modal">
            <div className="ha-modal-header">
              <div className="ha-modal-header-top">
                <div className="ha-modal-meta">
                  <span className="ha-category-tag" style={{ color: activeModalArticle.color }}>
                    {activeModalArticle.category}
                  </span>
                  <span className="ha-dot">•</span>
                  <span className="ha-read-time">
                    <Clock size={11} /> {activeModalArticle.readTime}
                  </span>
                </div>
                <button className="ha-modal-close" onClick={handleCloseModal}>
                  <X size={16} />
                </button>
              </div>
              <h2 className="ha-modal-title">{activeModalArticle.title}</h2>
              <p className="ha-modal-desc">{activeModalArticle.desc}</p>
            </div>

            <div className="ha-modal-body" style={{ '--art-color': activeModalArticle.color }}>
              <p className="ha-art-intro">{activeModalArticle.content.intro}</p>
              {activeModalArticle.content.sections.map((s, si) => (
                <div key={si} className="ha-art-section">
                  <h4 className="ha-art-section-title">{s.title}</h4>
                  <p className="ha-art-section-text">{s.text}</p>
                </div>
              ))}
            </div>

            <div className="ha-modal-footer">
              <div className="ha-footer-actions">
                <button className="ha-modal-close-btn" onClick={handleCloseModal}>
                  Close
                </button>
                <a
                  href={activeModalArticle.browseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ha-external-btn"
                >
                  Browse {activeModalArticle.browseLabel}
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  )
}
