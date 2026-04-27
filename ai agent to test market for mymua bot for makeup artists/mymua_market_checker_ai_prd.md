# PRD: MyMUA Market Checker AI

**Product Name:** MyMUA Market Checker AI  
**Internal Codename:** Market Checker / Market Analyzer  
**Version:** v1.0  
**Status:** Draft PRD  
**Primary Goal:** Validate whether Indian makeup artists are actually interested in paying for an Instagram AI booking assistant before building the full product.

---

## 1. Executive Summary

MyMUA Market Checker AI is an internal market-validation system for testing demand for a future product called **MyMUA AI Assistant**.

The future product will help makeup artists handle Instagram booking DMs, collect client details, qualify leads, and show serious inquiries in a dashboard. But before building the full assistant, we need proof that MUAs actually feel this pain and are willing to pay.

This PRD defines a smaller, faster tool: a **cold DM market research dashboard + AI conversation analyst**.

The system helps us manually message makeup artists, record when we sent messages, record when they replied, analyze their responses, generate natural non-salesy replies, score market interest, and produce real validation data.

The product is not designed to mass-spam or automate cold outreach. It is designed to support controlled manual outreach, conversation tracking, AI-assisted reply suggestions, and market analysis.

---

## 2. Core Product Definition

### One-line definition

**MyMUA Market Checker AI helps us test if makeup artists want an Instagram AI booking assistant by tracking cold DM conversations, analyzing replies, measuring interest, and showing which MUAs are likely to become beta users.**

### What it is

- Internal CRM for MUA prospects.
- Manual cold DM tracker.
- Reply-time tracker.
- Conversation storage system.
- Gemini-powered conversation analyst.
- AI reply suggestion engine.
- Market readiness scoring dashboard.
- Campaign experiment tracker.

### What it is not

- Not the final MUA client-facing assistant.
- Not a mass Instagram DM spammer.
- Not a fake bride conversation bot.
- Not a self-serve SaaS yet.
- Not an automatic outreach bot for thousands of accounts.

---

## 3. Background and Context

The intended future product is an Instagram DM assistant for makeup artists. It would respond to repeated booking inquiries like:

- “Price?”
- “Available?”
- “Bridal makeup charges?”
- “Party makeup price?”
- “Do you travel?”
- “How to book?”

The assistant would ask for:

- Service type.
- Event date.
- City or venue.
- WhatsApp number.
- Budget if needed.
- Reference look if needed.

Then it would show serious leads in a dashboard.

However, building the full assistant before market validation is risky. Many Indian MUAs may not immediately trust AI, may not want to pay, or may believe Instagram DMs are already manageable.

So the first product should test the market directly.

The key question is:

> Are makeup artists interested enough to reply, admit DM-handling pain, ask how the assistant works, ask price, request demo, or agree to beta pricing?

---

## 4. Product Objective

The main objective is to collect real market evidence before building the full assistant.

### Primary objectives

1. Track outreach to makeup artists.
2. Store full conversations.
3. Record sent time and reply time.
4. Calculate reply delay.
5. Use AI to analyze the conversation.
6. Detect pain signals.
7. Detect interest signals.
8. Generate natural reply suggestions.
9. Score each prospect.
10. Produce market-level analytics.
11. Decide whether to build the full MUA assistant.

### Business objective

Get enough validation to answer:

> Should we build MyMUA AI Assistant, and if yes, what exact positioning and pricing should we use?

---

## 5. Validation Hypothesis

### Main hypothesis

Makeup artists who receive booking DMs on Instagram lose time and leads because they manually answer repeated questions. A simple AI assistant that handles first replies and collects details can be valuable enough for them to consider paying.

### Sub-hypotheses

1. MUAs reply to simple non-salesy cold DMs more than direct product pitches.
2. MUAs understand the pain of repeated “price/available/bridal charges” messages.
3. Reply delay is a real and relatable problem.
4. MUAs are more comfortable if AI only collects details and does not confirm booking.
5. ₹499/month beta pricing is low enough to test willingness.
6. Serious bridal MUAs are more likely to care than beginner MUAs.
7. MUAs with higher DM load or higher bridal pricing are better prospects.

---

## 6. Target Users

### Internal users

#### 1. Founder / Operator

The main user is the person manually messaging MUAs and analyzing responses.

Needs:

- Add prospects quickly.
- Track who was messaged.
- Track who replied.
- Paste conversations.
- Get next reply suggestions.
- See who is hot/warm/cold.
- Know whether the market is worth building for.

#### 2. Future Sales Assistant

A future teammate could use the dashboard to handle outreach.

Needs:

- Clear statuses.
- Script suggestions.
- Follow-up reminders.
- Notes.
- Prospect scoring.

### External people being studied

These are not users of the Market Checker itself, but prospects.

#### Best MUA segments

1. Bridal MUAs.
2. Makeup studios.
3. MUAs with 5k–50k followers.
4. MUAs getting regular inquiries.
5. MUAs who mention booking/WhatsApp in bio.
6. MUAs with premium bridal pricing.
7. MUAs who post consistently.
8. MUAs with assistants or team members.
9. MUAs who run ads.
10. MUAs who have “DM for booking” in bio.

#### Weak MUA segments

1. Beginners.
2. Hobby artists.
3. Low-price artists.
4. MUAs with no active posts.
5. MUAs with very low inquiry volume.
6. MUAs who only work offline/referral.
7. MUAs whose family/team already handles DMs.

---

## 7. Success Criteria

### Market validation success after 100 contacted MUAs

The idea is worth building if:

- Reply rate is above 15%.
- At least 40% of replies confirm some DM-handling pain.
- At least 10% of replies ask how it works, ask price, or ask demo.
- At least 2 MUAs agree to beta/demo.
- At least 1 MUA is willing to pay or seriously test.

### Strong validation

The market looks strong if:

- Reply rate is above 25%.
- Pain-confirmed rate among replies is above 50%.
- Demo/price interest among replies is above 20%.
- 3–5 MUAs agree to beta.
- At least 1–2 pay or commit.

### Weak validation

The idea needs repositioning if:

- Reply rate is below 10%.
- Most replies say “not needed.”
- MUAs understand the product but do not ask price/demo.
- People ghost after product explanation.
- Nobody wants beta even at ₹499/month.

---

## 8. Core User Flow

### Flow A: Add prospect

1. Operator finds a MUA profile.
2. Operator adds prospect to dashboard.
3. Operator records username, city, followers, niche, bio, and notes.
4. Prospect status becomes `not_contacted`.

### Flow B: Send first DM manually

1. Operator opens Instagram.
2. Operator sends a soft opener manually.
3. Operator clicks `Mark First DM Sent` in dashboard.
4. System stores `first_message_sent_at`.
5. Status becomes `message_sent`.

### Flow C: MUA replies

1. Operator receives reply on Instagram.
2. Operator pastes reply or full conversation into dashboard.
3. Operator clicks `Mark Replied`.
4. System stores `first_reply_at`.
5. System calculates `reply_delay_minutes`.
6. Status becomes `replied`.

### Flow D: AI analyzes reply

1. System sends conversation context to Gemini.
2. Gemini returns structured JSON:
   - intent
   - mood
   - pain signal
   - interest score
   - objection
   - next best reply
   - next best action
   - market insight
3. System stores analysis.
4. Dashboard updates prospect score/status.

### Flow E: Operator sends next reply

1. Dashboard shows suggested reply.
2. Operator can edit it.
3. Operator copies it to Instagram manually.
4. Operator logs the sent message.
5. System continues conversation tracking.

### Flow F: Product intro

When pain is confirmed, AI suggests a simple product intro:

> “We’re building an Instagram booking assistant for MUAs. If someone DMs ‘bridal price?’, it asks date, city, service type and WhatsApp, then shows you a clean lead card. You can take over anytime.”

### Flow G: Outcome

The conversation ends in one of these statuses:

- `hot_beta_prospect`
- `warm_prospect`
- `research_lead`
- `not_interested`
- `ghosted`
- `demo_requested`
- `price_asked`
- `beta_closed`

---

## 9. Conversation Strategy

### Core principles

1. Start simple.
2. Do not pitch too early.
3. Do not sound like a spammer.
4. Ask about their workflow first.
5. Make them confirm pain before product explanation.
6. Mention reply delay gently, not aggressively.
7. Never pretend to be a bride.
8. Be honest that this is market testing.
9. Keep replies short.
10. Use Hinglish only if the MUA uses Hinglish/Hindi first.

### First message options

#### Option A

> Hey, quick question — do you handle your makeup booking DMs yourself?

#### Option B

> Hey, are you the one who handles booking inquiries on this page?

#### Option C

> Hey, small question — when brides message for makeup booking, do you reply yourself or someone from your team handles it?

### Pain discovery message

> Got it. Do you get repeated DMs like “price?”, “available?”, “bridal charges?” and then have to ask date, city and service type again?

### Reply-delay hook

Use only after they replied and only if the reply delay is meaningful.

Good wording:

> I noticed there was a reply gap here too, which is totally normal because artists are busy. That’s actually the problem we’re studying — brides often message multiple MUAs at once, and the first proper reply usually gets the conversation started.

Avoid:

> You replied after 5 hours so you are losing clients.

### Product explanation

> We’re building an Instagram booking assistant for MUAs. When someone DMs “bridal price?”, it replies naturally, asks event date + city + service type + WhatsApp, then shows you a clean lead card in a dashboard.

### Safety explanation

> It doesn’t confirm booking or give random prices. It only collects basic details first. Final confirmation stays with you.

### Price reply

> We’re testing beta pricing around ₹499/month for early MUAs. Right now the main goal is to see if it actually saves time and improves lead quality before making it a full product.

### AI reveal

Use only when context is good.

> Small honest note — I’m also using AI assistance to structure this conversation and test the flow. That’s basically the same idea: AI handles the repetitive first layer, but the human stays in control.

---

## 10. Product Scope

## MVP Scope

The MVP should include:

1. Prospect CRM.
2. Manual message tracking.
3. Reply delay calculation.
4. Conversation storage.
5. AI analysis.
6. AI next-reply suggestion.
7. Interest scoring.
8. Status pipeline.
9. Follow-up reminders.
10. Market analytics dashboard.
11. CSV export.

## Not in MVP

Do not build these in v1:

1. Auto cold DM sending.
2. Full Instagram API integration for outbound cold outreach.
3. Full MUA client assistant.
4. Payment collection.
5. Public landing page.
6. Self-serve onboarding.
7. Complex team roles.
8. WhatsApp integration.
9. Calendar integration.
10. Automated profile scraping at scale.

---

## 11. Feature Requirements

# 11.1 Prospect CRM

### Purpose

Store all makeup artists being tested.

### Required fields

- `id`
- `instagram_username`
- `artist_name`
- `city`
- `state`
- `followers_count`
- `following_count`
- `profile_url`
- `bio_text`
- `category`
- `services_detected`
- `has_website`
- `website_url`
- `website_quality_score`
- `profile_quality_score`
- `notes`
- `source`
- `status`
- `interest_score`
- `created_at`
- `updated_at`

### Category options

- `bridal_mua`
- `party_mua`
- `freelance_mua`
- `makeup_studio`
- `beauty_salon`
- `makeup_academy`
- `unknown`

### Status options

- `not_contacted`
- `message_sent`
- `replied`
- `pain_discovery`
- `pain_confirmed`
- `product_intro_sent`
- `asked_how_it_works`
- `asked_price`
- `demo_requested`
- `not_interested`
- `ghosted`
- `followup_needed`
- `hot_beta_prospect`
- `beta_closed`

---

# 11.2 Outreach Message Log

### Purpose

Store every message sent and received.

### Required fields

- `id`
- `prospect_id`
- `direction`: sent / received
- `channel`: instagram / whatsapp / manual_note
- `message_text`
- `sent_or_received_at`
- `is_first_message`
- `is_first_reply`
- `created_at`

### Key functions

- Add sent message.
- Add received reply.
- Edit timestamp.
- Delete wrong message.
- View full timeline.
- Copy generated reply.

---

# 11.3 Reply Delay Tracker

### Purpose

Measure how long it takes a MUA to reply.

### Calculations

- `first_reply_delay_minutes = first_reply_at - first_message_sent_at`
- `average_reply_delay_minutes`
- `longest_reply_delay_minutes`
- `last_reply_delay_minutes`

### Delay labels

- `instant`: under 10 minutes
- `fast`: 10–60 minutes
- `normal`: 1–6 hours
- `slow`: 6–24 hours
- `very_slow`: 24+ hours

### Usage

The system should not use delay as an insult. It should use delay as research context.

Example insight:

> Artist replied after 4h 20m. This supports the “busy artist / delayed first reply” angle, but mention it gently.

---

# 11.4 Conversation AI Analyzer

### Purpose

Analyze each conversation to understand prospect mood, pain, objections, and next step.

### Input

- Prospect profile.
- Full conversation.
- Reply delay.
- Current status.
- Previous analysis.

### Output JSON

```json
{
  "stage": "pain_discovery",
  "prospect_mood": "curious",
  "pain_confirmed": true,
  "pain_type": "repeated_price_dms",
  "interest_score": 72,
  "objection": null,
  "asked_price": false,
  "asked_demo": false,
  "should_use_reply_delay_hook": true,
  "next_reply": "Got it. Do you get repeated DMs like price/available/bridal charges and then have to ask date, city and service type again?",
  "next_action": "send_reply",
  "market_insight": "Artist handles DMs herself and may relate to repeated inquiry pain."
}
```

### Conversation stages

- `new_prospect`
- `opener_sent`
- `artist_replied`
- `dm_handling_question`
- `pain_discovery`
- `pain_confirmed`
- `reply_delay_hook`
- `product_intro`
- `objection_handling`
- `price_discussion`
- `demo_discussion`
- `ai_reveal`
- `closed_positive`
- `closed_negative`
- `followup_needed`

---

# 11.5 AI Reply Suggestion Engine

### Purpose

Suggest natural replies for the operator to send manually.

### Rules

- Short DM style.
- No long sales pitch.
- No pressure.
- No fake guarantee.
- No pretending to be a client.
- No creepy tracking language.
- Mention reply delay only when useful.
- Use exact MUA name only if it feels natural.
- Adapt to Hindi/Hinglish/English.

### Required output

- Suggested reply.
- Why this reply.
- Risk level.
- Alternative softer reply.

Example:

```json
{
  "suggested_reply": "Got it. Do you get repeated messages like price/available/bridal charges and then have to ask date, city and service type again?",
  "why": "Moves conversation from greeting to pain discovery without pitching yet.",
  "risk_level": "low",
  "alternative_reply": "Makes sense. Just curious, do booking DMs take a lot of your time?"
}
```

---

# 11.6 Interest Scoring System

### Purpose

Score how likely the MUA is to become a beta user.

### Positive signals

| Signal | Score |
|---|---:|
| Replied to opener | +10 |
| Handles DMs herself | +15 |
| Gets repeated price/availability DMs | +25 |
| Says she is busy | +20 |
| Says replies get delayed | +25 |
| Says she misses messages | +30 |
| Asks how it works | +20 |
| Asks if it replies automatically | +15 |
| Asks price | +20 |
| Asks for demo | +35 |
| Accepts beta | +50 |
| Shares WhatsApp/contact for demo | +40 |

### Negative signals

| Signal | Score |
|---|---:|
| Says not needed | -25 |
| Says team already handles DMs | -10 |
| Says no inquiries | -25 |
| Ghosts after product intro | -20 |
| Annoyed response | -40 |
| Says too expensive | -15 |
| Beginner/no budget signal | -20 |

### Score classes

| Score | Class |
|---:|---|
| 80+ | Hot beta prospect |
| 50–79 | Warm prospect |
| 25–49 | Research lead |
| 0–24 | Weak lead |
| below 0 | Avoid / not fit |

---

# 11.7 Market Analytics Dashboard

### Purpose

Show whether the market is responding.

### Core metrics

- Total prospects added.
- Total DMs sent.
- Total replies.
- Reply rate.
- Average reply delay.
- Median reply delay.
- Pain confirmed rate.
- Product intro response rate.
- Demo requested rate.
- Price asked rate.
- Beta close rate.
- Ghost rate.
- Not interested rate.
- Hot prospects count.
- Warm prospects count.

### Segmented metrics

Segment by:

- City.
- Follower range.
- Category.
- Has website vs no website.
- Bridal-focused vs general MUA.
- Opening message variant.
- Profile quality.
- Response delay group.

### Example market dashboard cards

- `100 contacted`
- `24 replied`
- `14 pain confirmed`
- `7 asked how it works`
- `4 asked price`
- `2 demo requested`
- `1 beta closed`

---

# 11.8 Campaign Manager

### Purpose

Test different outreach angles.

### Campaign fields

- `campaign_name`
- `target_city`
- `target_segment`
- `opening_message`
- `positioning_angle`
- `beta_price`
- `started_at`
- `ended_at`
- `notes`

### Example campaigns

#### Campaign 1: DM workload angle

Opening:

> Hey, quick question — do you handle your makeup booking DMs yourself?

#### Campaign 2: Bridal inquiry angle

Opening:

> Hey, small question — when brides message for booking, do you reply yourself or someone from your team handles it?

#### Campaign 3: Reply delay angle

Opening:

> Hey, do you usually get booking inquiries on Instagram DMs or mostly WhatsApp?

### Campaign comparison metrics

- Reply rate.
- Pain-confirmed rate.
- Demo interest rate.
- Price ask rate.
- Conversion to beta.

---

# 11.9 Follow-up System

### Purpose

Remind the operator to follow up manually.

### Follow-up types

- No reply after first DM.
- Replied but not answered after pain question.
- Asked demo but not scheduled.
- Asked price but did not confirm.
- Warm lead follow-up.

### Follow-up timings

- No reply after opener: 48–72 hours.
- Warm conversation paused: 24–48 hours.
- Demo requested: same day or next day.
- Price asked but silent: 24 hours.

### Example follow-up messages

#### No reply follow-up

> Just checking once — do you handle booking DMs yourself or someone from your team does it?

#### Warm follow-up

> Hey, just wanted to ask one thing — would a simple assistant that collects date/city/service from booking DMs be useful for your page?

#### Demo follow-up

> I can show you a tiny demo flow if you want — not a full sales pitch, just how it handles “bridal price?” DMs.

---

## 12. UI Requirements

# 12.1 Main Dashboard

### Sections

1. Summary stats.
2. Today’s follow-ups.
3. Hot prospects.
4. Recent replies.
5. Campaign performance.
6. Market verdict widget.

### Market verdict widget

The dashboard should show one of:

- `Too early: need more data`
- `Weak signal: change pitch`
- `Moderate signal: continue testing`
- `Strong signal: build beta product`

### Verdict rules

Strong signal if:

- 100+ contacted.
- Reply rate > 15%.
- Pain confirmed > 40% of replies.
- Demo/price interest > 10% of replies.
- 2+ beta interested.

---

# 12.2 Prospect List Page

### Columns

- Instagram username.
- Artist name.
- City.
- Followers.
- Category.
- Status.
- Reply delay.
- Interest score.
- Last message.
- Next follow-up.

### Filters

- Status.
- City.
- Category.
- Follower range.
- Interest score.
- Has website.
- Campaign.
- Follow-up due.

### Bulk actions

- Assign campaign.
- Export selected.
- Mark as contacted.
- Set follow-up.
- Archive.

---

# 12.3 Prospect Detail Page

### Sections

1. Profile summary.
2. Conversation timeline.
3. Timing analysis.
4. AI analysis.
5. Suggested next reply.
6. Status controls.
7. Notes.
8. Follow-up settings.

### Key buttons

- `Mark DM Sent`
- `Add Received Reply`
- `Analyze Conversation`
- `Copy Suggested Reply`
- `Set Follow-up`
- `Mark Not Interested`
- `Mark Demo Requested`
- `Mark Beta Closed`

---

# 12.4 Conversation Timeline

Messages should show:

- Direction: sent/received.
- Timestamp.
- Message body.
- Delay from previous message.
- AI-detected intent.

Example:

```txt
Sent 12:05 PM: Hey, quick question — do you handle your makeup booking DMs yourself?
Received 4:22 PM: Yes
Delay: 4h 17m
AI note: Reply confirmed. Good time to ask pain discovery question.
```

---

# 12.5 AI Analysis Panel

Should show:

- Current stage.
- Prospect mood.
- Pain confirmed yes/no.
- Interest score.
- Objection.
- Suggested reply.
- Why this reply.
- Risk warning.
- Market insight.

---

## 13. Technical Architecture

## Recommended stack

Since the existing project is already Next.js-based, use:

- Next.js app router.
- React dashboard.
- TypeScript.
- MySQL or Supabase Postgres.
- Gemini API for analysis and reply generation.
- Manual Instagram workflow in MVP.

### Important technical decision

Do not use LangChain in MVP.

Reason:

- The workflow is deterministic.
- One AI call per analysis is enough.
- LangChain adds complexity.
- Faster to build with direct Gemini API calls.

---

## 14. High-Level System Design

```txt
Manual Instagram Outreach
        ↓
Operator logs message in dashboard
        ↓
Prospect + message stored in DB
        ↓
MUA replies
        ↓
Operator logs reply
        ↓
System calculates reply delay
        ↓
Gemini analyzes conversation
        ↓
AI returns JSON analysis + next reply
        ↓
Dashboard updates status and score
        ↓
Operator sends next reply manually
        ↓
Market dashboard aggregates results
```

---

## 15. Database Schema

## prospects

```sql
CREATE TABLE prospects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  instagram_username VARCHAR(255) UNIQUE NOT NULL,
  artist_name VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  followers_count INT,
  following_count INT,
  profile_url TEXT,
  bio_text TEXT,
  category VARCHAR(100),
  services_detected TEXT,
  has_website BOOLEAN DEFAULT FALSE,
  website_url TEXT,
  website_quality_score INT DEFAULT 0,
  profile_quality_score INT DEFAULT 0,
  source VARCHAR(100),
  status VARCHAR(100) DEFAULT 'not_contacted',
  interest_score INT DEFAULT 0,
  notes TEXT,
  campaign_id INT,
  first_message_sent_at DATETIME NULL,
  first_reply_at DATETIME NULL,
  reply_delay_minutes INT NULL,
  last_message_at DATETIME NULL,
  next_followup_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## outreach_messages

```sql
CREATE TABLE outreach_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prospect_id INT NOT NULL,
  direction ENUM('sent', 'received') NOT NULL,
  channel VARCHAR(50) DEFAULT 'instagram',
  message_text TEXT NOT NULL,
  sent_or_received_at DATETIME NOT NULL,
  is_first_message BOOLEAN DEFAULT FALSE,
  is_first_reply BOOLEAN DEFAULT FALSE,
  ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## conversation_analyses

```sql
CREATE TABLE conversation_analyses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prospect_id INT NOT NULL,
  stage VARCHAR(100),
  prospect_mood VARCHAR(100),
  pain_confirmed BOOLEAN DEFAULT FALSE,
  pain_type VARCHAR(255),
  interest_score INT DEFAULT 0,
  objection VARCHAR(255),
  asked_price BOOLEAN DEFAULT FALSE,
  asked_demo BOOLEAN DEFAULT FALSE,
  should_use_reply_delay_hook BOOLEAN DEFAULT FALSE,
  suggested_reply TEXT,
  alternative_reply TEXT,
  next_action VARCHAR(100),
  market_insight TEXT,
  raw_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## campaigns

```sql
CREATE TABLE campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_name VARCHAR(255) NOT NULL,
  opening_message TEXT,
  positioning_angle VARCHAR(255),
  target_city VARCHAR(100),
  target_category VARCHAR(100),
  beta_price INT DEFAULT 499,
  started_at DATETIME,
  ended_at DATETIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## followups

```sql
CREATE TABLE followups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prospect_id INT NOT NULL,
  followup_at DATETIME NOT NULL,
  followup_reason VARCHAR(255),
  suggested_message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  completed_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## market_snapshots

```sql
CREATE TABLE market_snapshots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  snapshot_date DATE,
  total_prospects INT DEFAULT 0,
  total_contacted INT DEFAULT 0,
  total_replied INT DEFAULT 0,
  reply_rate DECIMAL(5,2) DEFAULT 0,
  pain_confirmed_rate DECIMAL(5,2) DEFAULT 0,
  demo_interest_rate DECIMAL(5,2) DEFAULT 0,
  price_asked_rate DECIMAL(5,2) DEFAULT 0,
  beta_closed_count INT DEFAULT 0,
  market_verdict VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 16. API Requirements

## Prospect APIs

### GET `/api/prospects`

Returns prospect list with filters.

### POST `/api/prospects`

Creates new prospect.

### GET `/api/prospects/:id`

Returns full prospect detail.

### PATCH `/api/prospects/:id`

Updates prospect.

### DELETE `/api/prospects/:id`

Archives/deletes prospect.

---

## Message APIs

### POST `/api/prospects/:id/messages`

Adds sent or received message.

### GET `/api/prospects/:id/messages`

Returns conversation timeline.

### POST `/api/prospects/:id/mark-sent`

Marks first outreach sent and stores timestamp.

### POST `/api/prospects/:id/mark-replied`

Stores first reply timestamp and calculates delay.

---

## AI APIs

### POST `/api/prospects/:id/analyze`

Runs Gemini analysis.

### POST `/api/prospects/:id/suggest-reply`

Returns next reply suggestion.

### POST `/api/prospects/:id/recalculate-score`

Recalculates interest score.

---

## Dashboard APIs

### GET `/api/dashboard/market-summary`

Returns aggregate market stats.

### GET `/api/dashboard/campaigns`

Returns campaign performance.

### GET `/api/dashboard/followups-due`

Returns follow-ups due today.

---

## Export APIs

### GET `/api/export/prospects.csv`

Exports prospect list.

### GET `/api/export/market-report.csv`

Exports market analytics.

---

## 17. AI Prompt Design

## System prompt

```txt
You are MyMUA Market Checker AI, an AI sales-research assistant.

Goal:
Help us test whether makeup artists in India want an Instagram AI booking assistant.

You are NOT a pushy salesperson.
You must sound natural, direct, short, and human.

Product:
MyMUA AI Assistant is an Instagram booking assistant for makeup artists.
It replies to client DMs, asks service type, event date, city/venue, WhatsApp number, and shows serious leads in a dashboard.
It does not confirm booking.
It does not invent pricing.
The artist stays in control.

Conversation strategy:
1. Start soft and non-salesy.
2. Ask whether the artist handles booking DMs herself.
3. Ask about repeated “price?”, “available?”, “bridal charges?” DMs.
4. If pain is confirmed, explain the assistant.
5. If there was reply delay, mention it gently, never insultingly.
6. Ask whether this would be useful.
7. If they ask price, mention beta around ₹499/month.
8. If they ask demo, offer a simple demo.
9. If not interested, ask one market-research question and exit politely.
10. Never pretend to be a bride.
11. Never lie.
12. If revealing AI assistance, do it honestly and smoothly.

Reply style:
- Short Instagram DM style.
- Hinglish only if the artist uses Hinglish/Hindi.
- No corporate language.
- No long paragraphs.
- No pressure.
- No fake guarantee.
- No “increase bookings guaranteed”.
- No creepy wording like “I tracked you”.
- Mention reply delay only as normal busy-artist behavior.

Return JSON only:
{
  "stage": "",
  "prospect_mood": "",
  "pain_confirmed": true,
  "pain_type": "",
  "interest_score": 0,
  "objection": "",
  "asked_price": false,
  "asked_demo": false,
  "should_use_reply_delay_hook": false,
  "next_reply": "",
  "alternative_reply": "",
  "next_action": "",
  "market_insight": ""
}
```

---

## 18. Guardrails

### AI must never

1. Pretend to be a bride.
2. Pretend to be a client.
3. Send messages automatically in MVP.
4. Pressure the MUA.
5. Insult the MUA for late reply.
6. Say “you are losing clients” directly.
7. Promise guaranteed bookings.
8. Claim the final assistant is fully ready if it is not.
9. Ask for passwords or Instagram credentials.
10. Tell the MUA to connect account before trust is built.
11. Hide that AI is involved if directly asked.

### AI should always

1. Stay honest.
2. Keep human in control.
3. Ask short questions.
4. Use market research framing.
5. Mention beta/testing honestly.
6. Respect no-interest responses.
7. Save learning from each conversation.

---

## 19. Compliance and Platform Risk Notes

The MVP should avoid automated cold outreach.

Manual messaging is safer for early testing. The dashboard can support message drafting and tracking, but sending should remain manual during validation.

For any future official Instagram integration, the product must follow Meta platform rules. The official Instagram Messaging API is designed for Instagram Professional accounts, and Meta messaging policies include a 24-hour standard messaging window after user interaction. Therefore, the final assistant should focus on replying to users who message the MUA first, not cold-spamming prospects.

---

## 20. Market Experiment Design

## Experiment 1: Soft DM handling question

### Message

> Hey, quick question — do you handle your makeup booking DMs yourself?

### Goal

Test if MUAs reply to a workflow question.

### Success metric

Reply rate above 15%.

---

## Experiment 2: Bridal inquiry pain

### Message

> Hey, small question — when brides message for makeup booking, do you reply yourself or someone from your team handles it?

### Goal

Test bridal-specific angle.

### Success metric

Pain-confirmed rate above 40% among replies.

---

## Experiment 3: Repeated price DM pain

### Message after reply

> Do you get repeated DMs like “price?”, “available?”, “bridal charges?” and then have to ask date, city and service type again?

### Goal

Measure if repeated inquiry pain is real.

### Success metric

At least 40% say yes/sometimes/many times.

---

## Experiment 4: ₹499 beta pricing

### Message if price asked

> We’re testing beta pricing around ₹499/month for early MUAs. Main goal right now is to see if it saves time and gives cleaner leads before launching fully.

### Goal

Test willingness to pay.

### Success metric

At least 2–3 out of 100 contacted agree to beta/demo.

---

## 21. Market Report Output

The system should generate a weekly report.

### Report sections

1. Total outreach.
2. Reply rate.
3. Average reply delay.
4. Top response cities.
5. Best opening message.
6. Most common pain.
7. Most common objection.
8. Number of price asks.
9. Number of demo requests.
10. Number of beta prospects.
11. Recommendation: build / change pitch / stop.

### Example report verdict

```txt
Market signal: Moderate-positive

100 MUAs contacted.
23 replied.
14 confirmed repeated booking DM pain.
5 asked how it works.
3 asked price.
2 requested demo.
1 agreed to beta.

Recommendation:
Continue testing with bridal-focused MUAs in Delhi, Ludhiana, Chandigarh and Mumbai. Build a small demo, not full product yet.
```

---

## 22. MVP Build Plan

## Phase 1: Manual tracker

### Build

- Prospect CRUD.
- Message log.
- Mark sent/replied.
- Reply delay calculation.
- Status pipeline.

### Completion criteria

- Can add 50 prospects.
- Can log sent/reply messages.
- Can calculate reply delay.
- Can export CSV.

---

## Phase 2: AI analysis

### Build

- Gemini API integration.
- Conversation analyzer.
- Reply suggestion engine.
- Interest score.
- Suggested next action.

### Completion criteria

- AI returns valid JSON.
- AI suggests usable short replies.
- AI correctly identifies price/demo/pain signals.

---

## Phase 3: Market dashboard

### Build

- Funnel dashboard.
- Campaign stats.
- Follow-up due list.
- Market verdict widget.

### Completion criteria

- Dashboard shows reply rate, pain rate, demo rate, price rate.
- Can compare campaigns.
- Can make build/no-build decision.

---

## Phase 4: Demo readiness

### Build

- Simple demo simulation of future MUA assistant.
- Fake lead card preview.
- Demo script for interested MUAs.

### Completion criteria

- When MUA asks demo, operator can send a clear example flow.

---

## 23. Development Priority

### Priority 0: Must build first

1. Prospect table.
2. Message log.
3. Sent/reply timestamps.
4. Reply delay calculation.
5. Status management.

### Priority 1

1. Gemini analysis.
2. Suggested next reply.
3. Interest scoring.
4. Market dashboard.

### Priority 2

1. Campaign A/B testing.
2. Follow-ups.
3. CSV exports.
4. Demo generator.

### Priority 3

1. Instagram API ingestion.
2. Auto profile enrichment.
3. Team workflow.
4. Payment/beta onboarding.

---

## 24. QA Test Cases

### Prospect tests

- Add prospect with username only.
- Add prospect with full details.
- Prevent duplicate username.
- Edit status.
- Delete/archive prospect.

### Message tests

- Add first sent message.
- Add first received message.
- Calculate reply delay correctly.
- Handle wrong timestamp edit.
- Handle multiple messages.

### AI tests

- Analyze “yes” reply.
- Analyze “not interested” reply.
- Analyze “price?” reply.
- Analyze Hindi/Hinglish reply.
- Detect pain confirmation.
- Detect demo request.
- Return valid JSON only.

### Dashboard tests

- Reply rate calculation.
- Pain rate calculation.
- Campaign comparison.
- Follow-up due count.
- Market verdict logic.

---

## 25. Risks

### Risk 1: MUAs think it is spam

Mitigation:

- Use simple research-style opener.
- Do not pitch in first message.
- Keep volume low.

### Risk 2: Reply-delay hook feels creepy

Mitigation:

- Use gentle wording.
- Never say “I tracked you.”
- Frame delay as normal busy-artist behavior.

### Risk 3: AI replies become too salesy

Mitigation:

- Strict prompt rules.
- Human sends manually.
- Show alternative softer reply.

### Risk 4: Market says no

Mitigation:

- Test different positioning.
- Try tattoo studios if MUA signal is weak.
- Adjust offer before building full product.

### Risk 5: Building too much before validation

Mitigation:

- Strict MVP scope.
- No auto DM.
- No full assistant until validation threshold is hit.

---

## 26. Product Decision Framework

## Build full MUA assistant if:

- 100+ MUAs contacted.
- Reply rate > 15%.
- Pain confirmed > 40% among replies.
- Demo/price interest > 10% among replies.
- At least 2 beta prospects.

## Pause or change pitch if:

- Reply rate is okay but pain is weak.
- People reply but do not ask how it works.
- People like idea but not at ₹499/month.
- Most think AI will be risky.

## Stop or pivot if:

- Reply rate below 10%.
- Almost nobody confirms pain.
- Nobody asks demo or price.
- People mostly get annoyed.

---

## 27. Future Product Bridge

If Market Checker validates demand, then build MyMUA AI Assistant.

The Market Checker should help define the final product by collecting:

- Most common MUA pain.
- Most common objections.
- Best price point.
- Best buyer segment.
- Best city.
- Best pitch.
- Best demo flow.

### Future assistant features based on validation

- Instagram DM auto-reply.
- Booking detail collection.
- Lead dashboard.
- Hot/warm/cold lead scoring.
- Manual takeover.
- Follow-up reminders.
- Artist settings.
- WhatsApp handoff.

---

## 28. Example Full Workflow

1. Add prospect: `@glambyxyz`, Delhi, 18k followers, bridal MUA.
2. Send manually: “Hey, quick question — do you handle your makeup booking DMs yourself?”
3. Mark sent at 12:00 PM.
4. MUA replies at 4:15 PM: “Yes I handle myself.”
5. System calculates reply delay: 255 minutes.
6. AI analyzes:
   - mood: neutral
   - stage: artist_replied
   - next reply: ask pain question
   - score: 10
7. Operator sends suggested pain question.
8. MUA replies: “Yes many people ask price and then disappear.”
9. AI updates:
   - pain_confirmed: true
   - pain type: price shoppers
   - score: 55
   - next reply: explain product softly
10. Operator introduces product.
11. MUA asks: “Will it reply automatically?”
12. AI suggests safety reply.
13. MUA asks price.
14. AI suggests beta pricing reply.
15. Status becomes `asked_price` / `warm_prospect`.
16. Follow-up set for next day.
17. Market dashboard counts this as one warm signal.

---

## 29. Final PRD Summary

MyMUA Market Checker AI is the correct first build before the full MUA assistant.

The goal is not to automate everything immediately. The goal is to gather real evidence.

The system should answer:

- Do MUAs reply?
- Do they handle DMs themselves?
- Do they feel repeated DM pain?
- Does reply delay matter to them?
- Do they trust AI if final booking stays human-controlled?
- Do they ask price/demo?
- Will anyone pay ₹499/month beta?

Only after this data is positive should the full MyMUA AI Assistant be built.

---

## 30. Brutal Founder Rule

Do not fall in love with the product before the market speaks.

Build the Market Checker first.

If the market signal is strong, build the assistant.

If the market signal is weak, change the pitch, change the niche, or go back to tattoo studios where your existing product is already stronger.

