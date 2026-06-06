# PropConnect: UI/UX Guidelines & Interface Design Standards
## Marketing-Driven Product Development for Real Estate P2P Platform

---

## Executive Summary

This document translates market research findings and user feedback into **actionable UI/UX guidelines** for PropConnect developers and Claude Code. It bridges the gap between marketing research and implementation, ensuring every interface element serves a strategic purpose: **reducing friction, building trust, and driving conversions**.

**Key Principle**: Every button, label, message, and form field must be justified by market research or user feedback.

---

## Part 1: CORE UX PRINCIPLES FOR PROPCONNECT

### Principle 1: Seller Empowerment Through Simplicity
**Market Research Finding**: Sellers are overwhelmed by legal complexity and fear of doing things wrong.

**UI Translation**:
- ❌ **Avoid**: 20-field forms that look like tax documents
- ✅ **Do**: 5-step progressive disclosure (one main action per screen)
- ✅ **Do**: Contextual help icons & tooltips explaining why each field matters

**Example Flow**:
```
Step 1: Basic Info (Property type, location)
Step 2: Highlights (What makes this special?)
Step 3: Photos & Media (Gallery)
Step 4: Price & Legal Checklist (Tax, disclosure guide)
Step 5: Review & Publish
```

### Principle 2: Trust Through Transparency & Verification
**Market Research Finding**: Scams, fraud, and unqualified buyers are top concerns.

**UI Translation**:
- ✅ Display **buyer verification status** prominently on inquiries
- ✅ Show **seller verification badge** on listings
- ✅ Clear **"Why this matters"** messages for each safety feature
- ✅ Prominent **fraud reporting** & contact seller options

**Example Badge System**:
```
🟢 VERIFIED FINANCING (Buyer pre-approved or pre-qualified)
🟡 PHONE VERIFIED (Phone number confirmed)
⚪ UNVERIFIED (No checks completed)
🔴 FLAGGED (Suspicious activity)
```

### Principle 3: Time & Cost Transparency
**Market Research Finding**: Sellers want to know total cost, timeline, and savings vs. agents.

**UI Translation**:
- ✅ Prominent **cost calculator** showing: "You save €X with direct sale (no agent commission)"
- ✅ **Timeline estimate**: "Typical sale: 6-10 weeks on PropConnect vs. 12+ weeks with agent"
- ✅ **Breakdown message**: "Your costs: Notary (€1,200) + Transfer Tax (€8,500) = €9,700 total"

### Principle 4: Mobile-First Design for Busy Sellers
**Market Research Finding**: Sellers manage properties while working; need quick, mobile-optimized interactions.

**UI Translation**:
- ✅ **Thumb-friendly buttons** (bottom-right placement on mobile)
- ✅ **One-tap showing scheduler** (not nested 3 clicks deep)
- ✅ **Push notifications** for new inquiries (not email-only)
- ✅ **Voice input** for bulk uploads (reduce typing)

### Principle 5: Regional Localization (Italy-First)
**Market Research Finding**: Italian market has unique legal, tax, and cultural norms.

**UI Translation**:
- ✅ All help text, templates, and disclaimers in Italian (not English defaults)
- ✅ Tax calculator using Italian tax rates (imposta di registro, regional variations)
- ✅ Legal templates referencing Italian law (Catasto, Law 129/1994)
- ✅ Cultural cues: "Face-to-face valued" → video tour emphasis, scheduling flexibility

---

## Part 2: SELLER-SIDE INTERFACE ARCHITECTURE

### Landing Page & Onboarding

#### 2.1 Hero Message (Above Fold)
**Market Finding**: Sellers need immediate reassurance and value proposition clarity.

**Design Guidelines**:

```
HEADLINE: "Vendi la Tua Casa Direttamente - Risparmi fino al 5%"
(Sell Your Home Directly - Save Up to 5%)

SUBHEADING: "Nessun agente immobiliare. Nessun intermediario. 
Solo tu, l'acquirente, e la tua proprietà. 
Più veloce, trasparente, ed economico."

CTA BUTTON: "Inizia a Vendere" (Large, contrasting color - teal/green)
Secondary CTA: "Scopri di più" (Link, not button - secondary importance)

VALUE PROPS (3 columns):
🚀 6-10 settimane | Più veloce che gli agenti
💰 Nessuna commissione | Paghi solo al closing
✅ Verificato e sicuro | Protezione contro frodi
```

**Rationale**:
- **5% savings** = concrete, credible number (vs. vague "save money")
- **Direct messaging** = reduces trust barrier ("just you and buyer")
- **Green/teal colors** = trust, growth (avoid red/aggressive)
- **Three value props** = cognitive load manageable; each solves a pain point

#### 2.2 Onboarding Flow - First-Time Seller

**Step 0: Qualification (Quick Screen)**
```
Question 1: "Quale tipo di proprietà vuoi vendere?"
Options (Radio buttons):
○ Casa indipendente
○ Appartamento
○ Villa
○ Terreno/Agricolo
○ Commerciale

Question 2: "In quale città/provincia?"
Input: Auto-complete dropdown (major cities highlighted: Milano, Roma, Napoli...)

Question 3: "È la prima volta che vendi una proprietà online?"
○ Sì, ho bisogno di aiuto
○ No, ho esperienza

🎯 Purpose: Trigger contextual help & legal guidance for first-timers.
If "Sì": Show "Beginner's Guide" modal before proceeding.
```

**Rationale**:
- **Segmentation early** = personalize experience
- **Auto-complete on cities** = reduce friction (no typing 100+ Italian communes)
- **Explicit "help needed" option** = signals that guidance is available, reduces fear

#### 2.3 Legal Checklist Module (Critical Trust Element)

**Position**: Early in flow, before listing goes public.

**Design**:

```
╔════════════════════════════════════════════════════════════╗
║ ⚖️  COMPLIANCE CHECKLIST                                   ║
║ Prima di pubblicare la tua proprietà, verifica quanto segue║
╚════════════════════════════════════════════════════════════╝

Each item is a toggle/checkbox with icon and expandable help:

☐ 1. Ho il titolo di proprietà registrato (Catasto)
     ℹ️  [Click to expand]
     "Questo è essenziale. Devi avere il documento di 
      proprietà ufficiale. Non puoi vendere senza."
     [Link] Dove trovare il mio titolo di proprietà?
     [Button] Carica file (optional but helpful)

☐ 2. Ho dichiarato tutte le imposte dovute sulla proprietà
     ℹ️  [Click to expand]
     "Se hai ritardi nei pagamenti, i tuoi acquirenti 
      avranno problemi al closing. Risolvi prima."

☐ 3. La proprietà non ha debiti ipotecari non dichiarati
     ℹ️  [Click to expand]
     "Un'ipoteca nascosta bloccherà la vendita. 
      Controlla il tuo estratto catastale."

☐ 4. Ho una copia dell'Atto di Compravendita originale
     ℹ️  [Click to expand]
     "Ti servirà per il closing. Cercalo nei tuoi 
      archivi o chiedi al notaio che l'ha redatto."

☐ 5. So quale sia la categoria catastale della proprietà
     ℹ️  [Click to expand]
     "Es: A/2 (abitazione civile), A/8 (villino). 
      È nel tuo estratto catastale."

╔════════════════════════════════════════════════════════════╗
🟢 ALL ITEMS COMPLETE
[Button] Procedi al Prossimo Passo
╚════════════════════════════════════════════════════════════╝

Bottom disclaimer:
⚠️  Questa checklist non è legale advice. Consulta un 
notaio per il tuo caso specifico. PropConnect consiglia 
di parlare con un professionista locale prima di vendere.

[Button] Contatta un Notaio (Partner link)
```

**Rationale**:
- **Mandatory but helpful** = sets expectations (not hiding complexity)
- **Expandable explanations** = educates without overwhelming
- **Checkboxes as confidence builders** = sellers feel more in control
- **Partner notary link** = creates revenue opportunity + builds trust

#### 2.4 Property Information Form (Progressive Disclosure)

**Page Layout**: Mobile-first card design, one question per "card", swipe or scroll.

```
CARD 1: BASIC INFO
┌─────────────────────────────────┐
│ 🏠 Informazioni Base             │
│ (1 di 5)                         │
├─────────────────────────────────┤
│ Tipo di Proprietà               │
│ [Dropdown: Casa / Apt / Villa]  │
│                                 │
│ Metratura (m²)                  │
│ [Input: 0] m²                   │
│ ℹ️ Usa il tuo atto di vendita    │
│                                 │
│ Numero Stanze                   │
│ [Input: 3] stanze               │
│                                 │
│ Bagni                           │
│ [Input: 1] bagni                │
│                                 │
│ Piano                           │
│ [Dropdown: Piano Terra / 1°...] │
│                                 │
│ [Button] Continua →             │
└─────────────────────────────────┘

CARD 2: HIGHLIGHTS (Selling Points)
┌─────────────────────────────────┐
│ ✨ Cosa Rende Speciale?          │
│ (2 di 5)                        │
├─────────────────────────────────┤
│ Seleziona fino a 5 caratteristiche│
│                                 │
│ ☐ Terrazza/Balcone             │
│ ☐ Giardino                      │
│ ☐ Piscina                       │
│ ☐ Garage/Parcheggio            │
│ ☐ Riscaldamento Centralizzato  │
│ ☐ Aria Condizionata            │
│ ☐ Recente Ristrutturazione     │
│ ☐ Efficienza Energetica (A/B)  │
│ ☐ Vista Panoramica             │
│ ☐ Recente Impianto Idraulico   │
│                                 │
│ [Button] Continua →             │
└─────────────────────────────────┘

CARD 3: ENERGY EFFICIENCY
┌─────────────────────────────────┐
│ ⚡ Efficienza Energetica        │
│ (3 di 5)                        │
├─────────────────────────────────┤
│ Conosci la classificazione?     │
│ [Radio buttons]                 │
│ ○ A (Eccellente - Nuovo)       │
│ ○ B (Buono)                    │
│ ○ C (Medio)                    │
│ ○ D (Vecchio / Inefficiente)   │
│ ○ Non so                        │
│                                 │
│ ℹ️ Questa informazione aumenta  │
│ l'interesse dei buyer. Se non   │
│ lo sai, un tecnico può farne    │
│ una certificazione.              │
│                                 │
│ [Link] Dove trovare il certificato│
│ [Link] Come ottenerlo           │
│                                 │
│ [Button] Continua →             │
└─────────────────────────────────┘

CARD 4: PHOTOS & MEDIA
┌─────────────────────────────────┐
│ 📸 Foto e Video                 │
│ (4 di 5)                        │
├─────────────────────────────────┤
│ Carica almeno 5 foto (ideal: 10)│
│                                 │
│ [Drag & Drop area]              │
│ o [Browse Button]               │
│                                 │
│ ℹ️ PRO TIP:                      │
│ • Buona illuminazione naturale  │
│ • Pulizia e ordine              │
│ • Inquadrature orizzontali      │
│ • Includi salotto, cucina, camere│
│ • Se hai video tour: perfetto!  │
│                                 │
│ [Button] Continua →             │
└─────────────────────────────────┘

CARD 5: PREZZO & CONFERMA
┌─────────────────────────────────┐
│ 💰 Prezzo di Vendita            │
│ (5 di 5)                        │
├─────────────────────────────────┤
│ Prezzo Richiesto (€)            │
│ [Input: 250000]                 │
│                                 │
│ [Button] Calcola il Prezzo Giusto│
│ → Opens modal with comps        │
│                                 │
│ Costi Stimati (informativo)     │
│ • Notaio: €1,200               │
│ • Imposta Registro: €8,500     │
│ • Altre tasse: €500            │
│ ─────────────                  │
│ TOTALE COSTI: €10,200          │
│ TUO RICAVO NETTO (circa): €239,800│
│                                 │
│ ℹ️ Questi sono stime. Consulta  │
│ un commercialista per cifre    │
│ esatte.                         │
│                                 │
│ [Checkbox] Ho letto e accetto  │
│ i termini e le condizioni      │
│                                 │
│ [Button] Pubblica Annuncio ✓    │
└─────────────────────────────────┘
```

**Rationale**:
- **One card per topic** = less cognitive load, mobile-friendly
- **Energy efficiency highlighted** = market differentiator (EU trend)
- **Cost transparency before publishing** = reduces buyer surprises & seller anxiety
- **PRO TIPS in context** = educate without separate tutorial

---

### Pricing Assistant Modal

**Trigger**: When seller clicks "Calcola il Prezzo Giusto"

**Design**:

```
╔════════════════════════════════════════════════════════════╗
║ 💹 Prezzo Consigliato per la Tua Proprietà                ║
╚════════════════════════════════════════════════════════════╝

MARKET DATA (based on location, size, type):
┌────────────────────────────────────────────────────────────┐
│ Proprietà Simili Vendute Recentemente (Napoli, Vomero)    │
│                                                            │
│ €220,000 ← Minimo (apt 85m², 2 camere, vecchio)         │
│ €250,000 ← MEDIA (apt 90m², 2 camere, ristrutturato)   │
│ €285,000 ← Massimo (apt 95m², 3 camere, nuovo)         │
│                                                            │
│ La tua proprietà: 90m², 2 camere, semi-ristrutturata    │
│ CONSIGLIO: €248,000 - €262,000                          │
│                                                            │
│ Giorni Medi sul Mercato:                                 │
│ • €230,000: 45 giorni (sopra media)                      │
│ • €250,000: 28 giorni (media)                           │
│ • €270,000: 60+ giorni (molto lento)                    │
│                                                            │
│ ℹ️ Prezzi più alti = più tempo vendere                    │
│    Prezzi più bassi = vendi in fretta (ma incassi meno) │
│                                                            │
│ Dati da: PropConnect database, ultimi 90 giorni          │
│ [Link] Vedi tutti i comparabili                          │
└────────────────────────────────────────────────────────────┘

[Input] Il tuo prezzo: [250000] €

[Button] Accetto e Continuo
[Button] Voglio Provare un Prezzo Diverso

⚠️  Ricorda: Questo è solo una stima basata su dati pubblici.
Un professionista potrebbe avere insight aggiuntivi.
```

**Rationale**:
- **Market comps justify the range** = reduces seller anxiety about pricing
- **Time-on-market data** = helps seller understand trade-offs (price vs. speed)
- **Clear source attribution** = builds credibility
- **Warning disclaimer** = manages expectations legally

---

### Listing Dashboard (After Publishing)

**Purpose**: Central hub for seller to manage inquiries, showings, messages.

**Layout** (Desktop + Mobile Views):

```
┌──────────────────────────────────────────────────────────────┐
│ 📊 DASHBOARD DEL VENDITORE                                  │
├──────────────────────────────────────────────────────────────┤

┌─ QUICK STATS (Top Row) ─────────────────────────────────────┐
│ 👁️ 127 Visualizzazioni     📞 12 Inquiries    📅 2 Viewings   │
│ (↑ 23 since yesterday)     (3 pending)        (scheduled)    │
└─────────────────────────────────────────────────────────────┘

┌─ ACTIVE INQUIRIES (Main Panel) ──────────────────────────────┐
│ Ordina: Più Recenti | Verificati Prima | Seri | Spam       │
│ Filtra: 🟢 Verificati | 🟡 Parziali | ⚪ No Verify | 🔴 Flag│
│                                                               │
│ [Inquiry Card 1]                                             │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Marco G. 🟢 VERIFIED                                 │  │
│ │ "Sono interessato. Posso vederla venerdì prossimo?" │  │
│ │                                                        │  │
│ │ ☑️ Financing Pre-Approved (€245k limit)              │  │
│ │ ☑️ Seriously Interested (tag)                        │  │
│ │ ✋ Save for Later                                    │  │
│ │                                                        │  │
│ │ [Button] Rispondi  [Button] Offerta  [⋮ More]       │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                               │
│ [Inquiry Card 2]                                             │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Agente Immobiliare - FLAGGED 🚩                      │  │
│ │ "Voglio portarvi miei clienti. Commissione?"        │  │
│ │ ← Not a direct buyer (agent). Block if desired.      │  │
│ │ [Button] Block User  [Button] Discuss               │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                               │
│ [Inquiry Card 3]                                             │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Giulia T. ⚪ UNVERIFIED                               │  │
│ │ "Interested. Phone number?"                           │  │
│ │ ← No financing info submitted. Ask for verification. │  │
│ │ [Button] Ask to Verify  [Button] Reply              │  │
│ └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─ SCHEDULED VIEWINGS (Secondary Panel) ──────────────────────┐
│ 📅 Venerdì, 14 Giugno, 10:00 AM                              │
│ Marco G. confirmed (reminder sent)                           │
│ [Button] Send Reminder  [Button] Reschedule  [Button] Cancel │
│                                                               │
│ 📅 Sabato, 15 Giugno, 14:30                                  │
│ Paolo M. tentative (awaiting confirmation)                   │
│ [Button] Send Confirmation Request                          │
└─────────────────────────────────────────────────────────────┘

┌─ MESSAGES HUB (Expandable) ─────────────────────────────────┐
│ All conversations in one place. Search, filter, archive.    │
│ [Button] View All Messages                                  │
└─────────────────────────────────────────────────────────────┘

┌─ PERFORMANCE & TIPS ────────────────────────────────────────┐
│ 💡 TIP: Tutte le foto hanno buona illuminazione.           │
│ Considera l'aggiunta di un video tour per +40% engagement. │
│ [Button] Upload Video Tour                                 │
│                                                              │
│ 📈 Confronto con Media:                                     │
│ • Visualizzazioni: 127 (media: 95) ✅ Sopra media          │
│ • Contatti: 12 (media: 8) ✅ Buono                          │
│ • Tempo Medio Contatto: 4 giorni (media: 7) ✅ Veloce       │
└─────────────────────────────────────────────────────────────┘

┌─ ACTIONS (Bottom) ──────────────────────────────────────────┐
│ [Button] Modifica Annuncio                                 │
│ [Button] Cambia Prezzo                                     │
│ [Button] Contatta Supporto                                 │
│ [Button] Ritira Annuncio                                   │
└─────────────────────────────────────────────────────────────┘
```

**Rationale**:
- **Stats at top** = quick health check on listing performance
- **Verification badges prominent** = reinforces trust filtering
- **Agent flagging** = sets expectations (some inquiries won't be genuine buyers)
- **Performance tips** = actionable, not generic
- **Comparisons to average** = motivates sellers ("you're doing better than average!")

---

## Part 3: BUYER-SIDE INTERFACE ARCHITECTURE

### 3.1 Search & Discovery Page

**Landing State** (No Search Yet):

```
┌──────────────────────────────────────────────────────────────┐
│ 🏠 Trova la Tua Casa Perfetta su PropConnect               │
├──────────────────────────────────────────────────────────────┤

SEARCH BAR (Sticky at Top):
┌────────────────────────────────────────────────────────────┐
│ 📍 Dove?  [Milano, Roma, Napoli...] + [Raggio: 5km]       │
│ 💰 Prezzo?  [€ Min: 100k] - [€ Max: 500k]                  │
│ 🛏️ Stanze?  [Min: 1] - [Max: 5+]                            │
│ 📐 Metratura? [Min: 50] - [Max: 200]                       │
│                                                             │
│ [Button] RICERCA AVANZATA ⬇️  [Button] CERCA 🔍           │
└────────────────────────────────────────────────────────────┘

FEATURED SAVED SEARCHES (if registered user):
"Case sotto €300k in centro (salvata 3 giorni fa) - 24 nuovi annunci"
"Appartamenti 2 camere, Roma Nord (salvata 1 settimana fa) - 7 nuovi"

TRENDING NOW:
🔥 Proprietà Più Visualizzate Questa Settimana
• Villa a Toscana (Siena): 3,200 views
• Apt Milano Duomo: 2,890 views
• Casa Amalfi Coast: 2,120 views

CALL-TO-ACTION:
[Button] Regístrati per Salvar Ricerche e Ricevere Avvisi
```

**After Search (Results Page)**:

```
┌──────────────────────────────────────────────────────────────┐
│ 📍 Milano | 💰 €100k-€500k | 🛏️ 1-5 stanze                  │
│ Risultati: 247 proprietà corrispondenti                     │
├──────────────────────────────────────────────────────────────┤

MAP VIEW (Left Side, 50% width on desktop):
[Interactive map showing property pins]
- Clicking pin = highlights listing on right
- Clustering for dense areas
- Price labels on pins
- Filter overlay (energy rating, highlights)

LISTINGS VIEW (Right Side, 50% width on desktop):
Sort: [Più Recenti | Prezzo Basso-Alto | Prezzo Alto-Basso]
Filter: [Ancora Filtra]

┌─ LISTING CARD (Repeating) ─────────────────────────────────┐
│ ┌─ PHOTO AREA (60% height) ─┐  │ INFO AREA (40% height)     │
│ │                           │  │ € 275.000                  │
│ │   [Main Photo]            │  │ ⭐⭐⭐⭐⭐ (23 reviews)        │
│ │   [4 thumb indicators]    │  │ Apt 90m² | 2 camere       │
│ │                           │  │ 📍 Vomero, Napoli          │
│ │                           │  │                            │
│ │                           │  │ ⚡ Classe B (Efficiente)   │
│ │                           │  │ 🚗 Parcheggio              │
│ │                           │  │ 🌳 Giardino Condiviso      │
│ │                           │  │                            │
│ │                           │  │ Venditore: Marco G.        │
│ │                           │  │ 🟢 Verificato | 4/5 ⭐     │
│ │                           │  │                            │
│ │   📸 10 foto              │  │ [Button] Visualizza       │
│ │   🎥 Video Tour           │  │ [♥️ Salva]  [Share]        │
│ └───────────────────────────┘  │                            │
└────────────────────────────────────────────────────────────┘

[More Listing Cards...]

PAGINATION: [1] [2] [3] [Next >]
```

**Rationale**:
- **Map + List dual view** = serves different buyer preferences
- **Seller verification visible** = builds trust
- **Energy rating prominent** = EU regulation trend
- **Pin key features** = quick scan (parking, garden) vs. click for details

---

### 3.2 Detailed Property Page

```
┌──────────────────────────────────────────────────────────────┐
│ ⬅️ Back to Results | ❤️ Save | 📤 Share | ⋯ Report           │
├──────────────────────────────────────────────────────────────┤

PHOTO GALLERY (Hero, Full Width):
╔────────────────────────────────────────────────────────────╗
║                                                            ║
║            [Large Main Photo]                             ║
║                                                            ║
║        ◀️  [Thumbnails: 1 2 3 4 5 ...] ▶️               ║
╚────────────────────────────────────────────────────────────╝

PRICE & KEY INFO (Below Photo):
┌────────────────────────────────────────────────────────────┐
│ 💰 €275.000  | 90m² | 2 Camere | 1 Bagno | Piano 4°       │
│                                                            │
│ ⚡ Classe B (Buono) | 🚗 Parcheggio | 🌳 Giardino         │
│ 🏢 Condominio | Ascensore | Riscaldamento Centralizzato   │
│                                                            │
│ 📍 Vomero, Napoli | Vicino a Stazione Metro (300m)       │
│                                                            │
│ 📊 PRICE ANALYSIS:                                         │
│ Questa proprietà: €275,000                                │
│ Media del quartiere: €280,000 (Sopra media di -2%)        │
│ Buona opportunità! ✅                                      │
└────────────────────────────────────────────────────────────┘

DESCRIPTION & KEY FACTS:
┌────────────────────────────────────────────────────────────┐
│ 📝 Descrizione (Expandable)                                │
│                                                            │
│ "Incantevole appartamento al 4° piano a Vomero,          │
│  con vista sulla città. Recentemente ristrutturato.       │
│  Ideale per giovane coppia o investitore.                │
│  Richiede pochi lavori. Parcheggio disponibile."         │
│                                                            │
│ [⬇️ Mostra di più]                                         │
└────────────────────────────────────────────────────────────┘

SELLER INFO (Trust Section):
┌────────────────────────────────────────────────────────────┐
│ Venditore: Marco G.                                        │
│ 🟢 VERIFICATO  | Membro da 8 mesi                         │
│ ⭐ 4.7/5.0 (23 reviews) [Link: View All Reviews]         │
│                                                            │
│ "Proprietario diretto. Vendo perché trasloco."            │
│                                                            │
│ [Button] Visualizza Altre Proprietà di Marco (2)          │
│ [Button] Invia Messaggio al Venditore                     │
└────────────────────────────────────────────────────────────┘

COST BREAKDOWN (Transparent):
┌────────────────────────────────────────────────────────────┐
│ 💵 Stime di Costo per l'Acquirente                         │
│                                                            │
│ Prezzo Acquisto: €275.000                                 │
│ + Imposta Registro: €13.750 (5%)                          │
│ + Notaio & Atto: €1.200                                  │
│ + Altre Tasse: €500                                       │
│ ─────────────                                             │
│ COSTO TOTALE STIMATO: €290.450                            │
│                                                            │
│ ℹ️ Queste sono stime. Consulta un commercialista         │
│    per cifre esatte.                                       │
│                                                            │
│ [Mortgage Calculator] Simula il tuo mutuo...             │
└────────────────────────────────────────────────────────────┘

LOCATION & AMENITIES:
┌────────────────────────────────────────────────────────────┐
│ 📍 POSIZIONE & SERVIZI                                     │
│                                                            │
│ [Interactive Map Embed]                                   │
│ • 300m da Stazione Metro (Linea 1)                       │
│ • 2km da Università Federco II                           │
│ • 500m da Ospedale Cardarelli                            │
│ • Zona commerciale nelle vicinanze                       │
│ • Scuole nelle vicinanze                                 │
│                                                            │
│ [Link] Esplora il Quartiere in Dettaglio                 │
└────────────────────────────────────────────────────────────┘

BUILDING INFO:
┌────────────────────────────────────────────────────────────┐
│ 🏢 INFORMAZIONI EDIFICIO                                   │
│                                                            │
│ Costruito: 1985 | Ristrutturato: 2022                     │
│ Piano: 4° di 6 | Ascensore: Sì                            │
│ Riscaldamento: Centralizzato (incluso in spese)          │
│ Spese Condominio: €100/mese                              │
│                                                            │
│ ℹ️ Spese condominio copre: riscaldamento, acqua,         │
│    manutenzione, assicurazione edificio, ascensore.      │
└────────────────────────────────────────────────────────────┘

CALL-TO-ACTION (Sticky at Bottom on Mobile):
┌────────────────────────────────────────────────────────────┐
│ [Button - Primary] RICHIEDI VISUALIZZAZIONE              │
│                                                            │
│ Seleziona giorno/ora preferiti:                           │
│ 📅 [Calendario Interattivo]                               │
│                                                            │
│ [Button - Secondary] CONTATTA VENDITORE                  │
│ [Button - Secondary] FISSA OFFERTA                        │
└────────────────────────────────────────────────────────────┘

REVIEWS & QUESTIONS:
┌────────────────────────────────────────────────────────────┐
│ 💬 DOMANDE FREQUENTI                                       │
│                                                            │
│ Q: "La proprietà è disponibile subito?"                   │
│ A: "No, consegna tra 30 giorni dopo firma."              │
│ Helpful? [👍 10]  [👎 2]                                  │
│                                                            │
│ Q: "Quali sono i problemi di cui nessuno parla?"         │
│ A: "L'ascensore è vecchio, potrebbe avere costi di       │
│     manutenzione nei prossimi anni."                     │
│ Helpful? [👍 18]  [👎 1]                                  │
│                                                            │
│ [Button] Fai una Domanda                                 │
└────────────────────────────────────────────────────────────┘

BOTTOM NAVIGATION:
[◀️ Precedente] | [Proprietà Simili] | [Prossimo ▶️]
```

**Rationale**:
- **Cost breakdown critical** = addresses buyer anxiety (hidden costs)
- **Seller reputation visible** = reduces fraud risk
- **Neighborhood detail** = justifies price
- **Q&A section** = crowdsourced truth vs. seller spin
- **Sticky CTA on mobile** = reduces friction to contact/book

---

### 3.3 Inquiry & Verification Flow

**When Buyer Clicks "Richiedi Visualizzazione"**:

```
Step 1: QUICK VERIFICATION (Modal)
┌────────────────────────────────────────────────────────────┐
│ Prima di contattare il venditore, aiutaci a verificarti  │
│                                                            │
│ ☐ Nome: [Marco Rossi]                                     │
│ ☐ Email: [marco@example.com]                              │
│ ☐ Telefono: [+39 081 123 4567]                            │
│   [Send SMS verification code]                            │
│                                                            │
│ Sei interessato come:                                      │
│ ○ Acquirente Privato                                      │
│ ○ Investitore                                             │
│ ○ Agente Immobiliare (Trasparente per venditore)         │
│                                                            │
│ Hai Pre-Approvazione Finanziaria?                         │
│ ○ Sì (Upload documento)                                  │
│ ○ Cercando Finanziamento                                 │
│ ○ Pagamento Cash                                          │
│ ○ Non So Ancora                                           │
│                                                            │
│ [Button] Continua                                         │
└────────────────────────────────────────────────────────────┘

Step 2: SCHEDULE VIEWING
┌────────────────────────────────────────────────────────────┐
│ 📅 Quando Vorresti Vederla?                               │
│                                                            │
│ Proposte disponibili (per Marco G.):                      │
│ ☑️ Venerdì 14 Giugno, 10:00 AM                            │
│ ☑️ Venerdì 14 Giugno, 14:00 PM                            │
│ ☑️ Sabato 15 Giugno, 10:00 AM                             │
│ ☑️ Un'altra ora/data (tell seller)                        │
│                                                            │
│ [Button] Conferma e Invia Richiesta                       │
│                                                            │
│ ℹ️ Il venditore riceverà la tua richiesta verificata.    │
│    Ti contatterà entro 24 ore.                            │
└────────────────────────────────────────────────────────────┘

Step 3: CONFIRMATION
┌────────────────────────────────────────────────────────────┐
│ ✅ Richiesta Inviata!                                      │
│                                                            │
│ Marco G. riceverà la tua richiesta verificata:            │
│ • Nome, email, telefono                                   │
│ • Preferenza oraria (Venerdì 14 Giugno, 10:00 AM)       │
│ • Status finanziario (Cash)                              │
│                                                            │
│ ⏰ Aspetta una risposta entro 24 ore.                      │
│                                                            │
│ Nel frattempo:                                             │
│ [Link] Scopri Proprietà Simili                            │
│ [Link] Leggi Guida "Come Negoziare"                       │
│                                                            │
│ [Button] Torna ai Risultati                               │
└────────────────────────────────────────────────────────────┘
```

**Rationale**:
- **Verification upfront** = assures sellers, reduces spam/fake inquiries
- **Financing transparency** = sells faster (pre-approved buyers prioritized)
- **Agent tag visible** = sets expectations for both parties
- **Follow-up guidance** = reduces confusion

---

## Part 4: MESSAGING & LANGUAGE GUIDELINES

### 4.1 Critical Message Frameworks

#### Framework 1: Trust & Verification
```
❌ AVOID:
"Your listing is pending verification."
(Too corporate, doesn't explain why or what's next)

✅ USE:
"✅ Annuncio Verificato
La tua proprietà è stata controllata dai nostri team. 
Ora i compratori sanno che sei un venditore serio."

RATIONALE: 
- Positive framing (what they get, not what they don't)
- Italian language & tone
- Explains benefit (buyers see verification)
```

#### Framework 2: Legal/Compliance Warnings
```
❌ AVOID:
"You are responsible for all legal disclosures. 
PropConnect assumes no liability."
(Scary, legalistic, defensive)

✅ USE:
"⚖️ Importante: Proteggiti e l'Acquirente
Le leggi italiane richiedono che tu dichiari lo stato 
della proprietà. Abbiamo una checklist per aiutarti—
ma consigliamo di consultar un notaio per il tuo caso specifico.

🔗 [Contatta un Notaio Partner]"

RATIONALE:
- Proactive (helps seller comply)
- Clear, not scary
- Offers solution (partner notaries)
- Acknowledges professional help needed
```

#### Framework 3: Pricing Guidance
```
❌ AVOID:
"Adjust your price immediately."
(Pushy, might offend seller)

✅ USE:
"💡 Prezzi Simili sul Mercato
Le proprietà simili nella tua zona vendono in media 
a €250k. Tu chiedi €280k—questo è +12% sopra la media.

Questo potrebbe significare:
• Vendita più lenta (60+ giorni vs. 30 giorni media)
• Meno inquiries

Cosa fare?
Option A: Mantieni €280k (aspetta più tempo)
Option B: Riduci a €265k (vendi in ~40 giorni)
Option C: Mantieni ma aggiungi video tour (boost engagement +40%)

🔗 [Vedi tutti i comparabili] | [Carica Video Tour]"

RATIONALE:
- Data-driven (not opinion)
- Options given (seller chooses)
- Suggests action (video tour = alternative to price cut)
- Empowers rather than dictates
```

#### Framework 4: Buyer Inquiry Filtering
```
❌ AVOID:
"This buyer is unverified."
(Negative, doesn't help seller decide)

✅ USE:
"🟡 Inquietà Verificata Parzialmente
Luigi M. ha confermato il telefono, ma non ha 
caricato pre-approvazione finanziaria.

Segnali Positivi:
✅ Telefono verificato
✅ Membro da 6 mesi
✅ Ha visto 47 proprietà simili (serio)

Segnali di Cautela:
⚠️ Nessuna pre-approvazione

Suggerimento:
Rispondi cortesemente, ma chiedi: 'Hai finanziamento 
approvato?' Se non rispondono, potrebbe essere 
un time-waster.

🔗 [Contatta Luigi]"

RATIONALE:
- Balanced (not all-or-nothing)
- Gives seller pattern-recognition clues
- Actionable question suggested
- Empowers without dictating
```

---

### 4.2 Button Labels & CTAs

**Primary CTAs** (Seller-Focused):

```
✅ CORRECT BUTTON LABELS:

Listing Form:
- [Pubblica Annuncio] → Clear action (not "Submit" or "Next")

Pricing:
- [Calcola il Prezzo Giusto] → Empowering (vs. "Auto-Price")
- [Cambio Prezzo] → Acknowledges seller agency

Inquiries:
- [Rispondi al Buyer] → Direct, friendly
- [Proponi Offerta] → Active (not "Negotiate")
- [Accetta Visita] → Commitment language

Messaging:
- [Invia Messaggio] → Simple (not "Send Communication")
- [Conferma Visita] → Commitment

Dashboard:
- [Modifica Annuncio] → Transparent (user knows they can change)
- [Ritira Annuncio] → Honest (not "Pause" or "Suspend")

❌ AVOID:
- "Submit" (too formal, not real estate)
- "Proceed" (vague)
- "Next" (no context)
- "Agree" (scary, legalistic tone)
- "Accept" (transaction-y)
```

**Primary CTAs** (Buyer-Focused):

```
✅ CORRECT BUTTON LABELS:

Search & Discovery:
- [Richiedi Visualizzazione] → Personal (vs. "Schedule Tour")
- [Salva Proprietà] → Simple favorite action
- [Contatta Venditore] → Direct (vs. "Send Inquiry")

Property Details:
- [Fissa Offerta] → Action-oriented
- [Scaricare Documentazione] → Specific action
- [Calcola il Tuo Mutuo] → Helpful, specific

Negotiation:
- [Proponi Prezzo] → Diplomatic (not "Make Offer")
- [Chiedi Riduzione] → Specific ask (not "Negotiate")

❌ AVOID:
- "Apply" (sounds like job application)
- "Continue" (vague)
- "Learn More" (if it's actually a strong CTA, don't soften)
```

---

## Part 5: CONTENT & EDUCATIONAL MATERIALS

### 5.1 Help Center Structure

**Must-Have Articles** (In Italian):

1. **Per Venditori Privati**
   - "Guida Completa: Come Vendere la Tua Casa Direttamente"
   - "Quanto Vale la Mia Proprietà? Come Calcolare il Prezzo Giusto"
   - "Obblighi Legali del Venditore in Italia"
   - "Come Gestire le Visite e le Negoziazioni"
   - "Tasse e Costi di Chiusura: Cosa Aspettarsi"
   - "Come Proteggere Te Stesso dalle Frodi"

2. **Per Buyer Privati**
   - "Guida Completa: Come Comprare una Casa Direttamente dal Proprietario"
   - "Come Fare un'Offerta Vincolante"
   - "Come Negoziare il Prezzo (Strategie Comprovate)"
   - "Finanziamento e Mutui: Opzioni in Italia"
   - "Processo di Chiusura Spiegato Passo Passo"
   - "Come Evitare Truffe e Proteggere i Tuoi Soldi"

3. **General Info**
   - "Glossario Immobiliare Italiano"
   - "FAQ: Domande Frequenti"
   - "Chi è il Notaio e Perché Serve"
   - "Imposta di Registro, Plusvalenze, e Altre Tasse Spiegate"

---

### 5.2 Video Tutorial Specs

**Recommended Format**:
- **Length**: 5-8 minutes (mobile-optimized, scannable)
- **Language**: Italian, clear Italian (avoid regional dialects)
- **Captions**: Always (for mobile mute viewing)
- **Host**: Friendly, relatable (not corporate)
- **Content**: Step-by-step, screen recording + talking head mix

**Video Titles**:
1. "Carica le Foto Perfette per la Tua Proprietà"
2. "Come Descrivi una Proprietà che Vende Veloce"
3. "La Checklist Legale: Niente Sorprese al Chiusura"
4. "Qual è il Prezzo Giusto? Metodo Semplice"
5. "Come Reagire a Offerte Basse" (Negotiation Tips)

---

## Part 6: MOBILE-FIRST PRINCIPLES

### 6.1 Mobile Navigation

**Bottom Navigation Tabs** (Always Accessible):

```
[🏠 Home] [🔍 Cerca] [💬 Messaggi] [❤️ Salvati] [👤 Profilo]
```

**Why**:
- Thumb-friendly (not shoulder-friendly top nav)
- 5 main actions only (cognitive load manageable)
- Clear icons + labels
- Consistent across app

---

### 6.2 Form Design on Mobile

```
✅ DO:
- One question per screen (swipe between screens)
- Large input fields (44px min touch height)
- Clear labels above inputs
- Helper text below (not placeholder text)
- Save progress (user can come back)

❌ DON'T:
- Multi-column layouts (stacking nightmare on mobile)
- Tiny dropdowns (hard to tap)
- Hiding labels in placeholders
- Forcing completion in one session
```

---

### 6.3 Performance on Slow Networks

```
✅ DO:
- Lazy load images (scroll to reveal)
- Skeleton screens while loading
- Cache frequently-accessed data
- Compress images aggressively

❌ DON'T:
- Auto-play videos
- Load full gallery immediately
- Unoptimized hero images (max 300KB)
```

---

## Part 7: ACCESSIBILITY & INCLUSIVE DESIGN

### 7.1 Color Contrast
- Text on buttons: WCAG AAA compliant (7:1 ratio minimum)
- Info boxes: No color-only coding (pair color with icon/text)

### 7.2 Font Sizing
- Body text: 16px minimum on mobile
- Labels: 14px minimum
- Headings: 24px+

### 7.3 Keyboard Navigation
- All CTAs reachable via Tab key
- No keyboard traps
- Focus state visible (not just hover)

### 7.4 Screen Reader Compatibility
- Alt text for all property photos (descriptive, not just "photo 1")
- Form labels linked to inputs (not floating labels)
- Aria labels on icons

---

## Part 8: SUCCESS METRICS & MONITORING

### 8.1 UX Metrics That Indicate Success

**Seller-Side**:
- Listing completion rate: >80% (onboarding not abandonment)
- Legal checklist completion: >85% (compliance)
- Time to first inquiry: <72 hours (platform healthy)
- Seller satisfaction (NPS): >50

**Buyer-Side**:
- Search-to-detail conversion: >15% (listings compelling)
- Inquiry abandonment rate: <30% (verification not too friction-heavy)
- Message response rate: >60% (community active)

**Overall**:
- Mobile traffic share: >60% (mobile-first working)
- Load time (p95): <2 seconds (performance good)
- Listing-to-sale conversion: >20% (platform functional)

---

## Part 9: IMPLEMENTATION CHECKLIST FOR CLAUDE CODE

When building features, Claude Code should verify:

```
✅ LEGAL COMPLIANCE:
- [ ] Italian tax & notary info accurate
- [ ] Disclaimer language in Italian
- [ ] Disclosure checklist matches Italian law

✅ SELLER EMPOWERMENT:
- [ ] Legal guidance before publishing
- [ ] Price comparison with market data
- [ ] Cost transparency (notary, taxes, etc.)
- [ ] Buyer verification visible on dashboard

✅ BUYER TRUST:
- [ ] Seller verification prominent
- [ ] Cost breakdown on property page
- [ ] Q&A section (crowdsourced truth)
- [ ] Fraud prevention (ID, financing checks)

✅ MOBILE-FIRST:
- [ ] Bottom tab navigation
- [ ] Thumb-friendly buttons (bottom-right)
- [ ] Forms: one question per screen
- [ ] Images lazy-loaded
- [ ] Load time < 2 seconds (p95)

✅ LOCALIZATION:
- [ ] All UI text in Italian
- [ ] Italian place names (auto-complete)
- [ ] Italian currency (€)
- [ ] Italian date format (DD/MM/YYYY)
- [ ] Italian tax/legal references

✅ MESSAGING:
- [ ] No corporate jargon
- [ ] Actionable CTAs (not "Submit")
- [ ] Empower users (not dictate)
- [ ] Balance legal/safety without scaring

✅ ACCESSIBILITY:
- [ ] Color contrast: WCAG AAA
- [ ] Font size: 14px min
- [ ] Keyboard navigation: Tab works
- [ ] Screen reader: Alt text on images
```

---

## Conclusion

This document serves as the **bridge between market research and implementation**. Every interface element, button label, and help message has been justified by:
1. Market findings (Italian market, P2P adoption barriers)
2. User feedback (seller pain points, buyer frustrations)
3. Competitive analysis (what Zillow, Immobiliare.it do well/poorly)

**For Claude Code**: Use this as a reference when building features. When in doubt, return to these principles and ask: "Does this reduce friction? Does this build trust? Is this localized for Italy?"

---

**Document Version**: 1.0  
**Last Updated**: June 2026  
**Audience**: Developers, Designers, Product Managers  
**Status**: Ready for Implementation
