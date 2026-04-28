# STTHK2133 Assignment 1

## Discrete Choice Model for Undergraduate Programme Selection

This project implements a discrete choice model to simulate how a student chooses between six undergraduate programme paths:

- Pure Sciences
- Applied Sciences
- Engineering
- Accounting
- Management
- Arts

The project includes:

- an Octave version of the model
- a JavaScript web version for GitHub Pages deployment
- assignment documentation in Word format

---

## Project Objective

The purpose of this project is to model programme selection as a **discrete choice problem**.  
A student chooses one programme from a finite set of alternatives, and that choice depends on the perceived utility of each option.

Each programme is evaluated using six factors:

- Interest
- Exam Results
- Career
- Location
- Fees
- Explore

The model calculates:

1. the **utility score** for each programme
2. the **probability** of choosing each programme using the **Multinomial Logit Model**

---

## Files in This Project

- [student_program_choice_app.m](./student_program_choice_app.m)  
  Octave implementation of the discrete choice model

- [index.html](./index.html)  
  Main web page for GitHub Pages deployment

- [style.css](./style.css)  
  Styling for the web application

- [script.js](./script.js)  
  JavaScript logic for the browser-based model

- [STTHK2133_Assignment01_SectionA_Answers.docx](./STTHK2133_Assignment01_SectionA_Answers.docx)  
  Written answers for Section A, Section B Part I, and Section B Part III

- [STTHK2133_Assignment01_PartII_No1_No2_Documentation.docx](./STTHK2133_Assignment01_PartII_No1_No2_Documentation.docx)  
  Earlier documentation for Part II no. 1 and 2

---

## Model Formulation

### 1. Utility Function

For each programme \( j \), utility is calculated as:

`U(j) = w1*x1 + w2*x2 + w3*x3 + w4*x4 + w5*x5 + w6*x6`

Where:

- `w` = importance weight of a factor
- `x` = score of that programme on the factor

In this assignment, the factors are:

- `x1` = Interest
- `x2` = Exam Results
- `x3` = Career
- `x4` = Location
- `x5` = Fees
- `x6` = Explore

### 2. Multinomial Logit Probability

After utility is computed, the probability of choosing programme \( j \) is:

`P(j) = exp(U(j)) / Σ exp(U(k))`

This means:

- a higher utility gives a higher choice probability
- all programme probabilities will sum to 1

---

## Baseline Data Used in the Assignment

### Programme Ratings (Table 1)

| Programme | Interest | Exam Results | Career | Location | Fees | Explore |
|---|---:|---:|---:|---:|---:|---:|
| Pure Sciences | 5 | 5 | 3 | 3 | 4 | 2 |
| Applied Sciences | 4 | 5 | 4 | 3 | 3 | 3 |
| Engineering | 4 | 5 | 5 | 2 | 5 | 2 |
| Accounting | 3 | 4 | 4 | 4 | 4 | 2 |
| Management | 3 | 3 | 3 | 5 | 3 | 3 |
| Arts | 2 | 3 | 2 | 4 | 2 | 4 |

### Factor Weights (Table 2)

| Factor | Weight |
|---|---:|
| Interest | 0.30 |
| Exam Results | 0.20 |
| Career | 0.25 |
| Location | 0.10 |
| Fees | 0.10 |
| Explore | 0.05 |

---

## Default Assignment Result

Using the given baseline values:

| Programme | Utility | Probability |
|---|---:|---:|
| Pure Sciences | 4.05 | 22.71% |
| Applied Sciences | 3.95 | 20.55% |
| Engineering | 4.25 | 27.74% |
| Accounting | 3.60 | 14.48% |
| Management | 3.20 | 9.71% |
| Arts | 2.50 | 4.82% |

### Predicted Choice

The highest probability is for:

`Engineering = 27.74%`

This means the model predicts that Aiman is most likely to choose **Engineering** under the given profile.

---

## Code Documentation

## Octave Code

The Octave script is in [student_program_choice_app.m](./student_program_choice_app.m).

### What it does

- stores the six programmes
- stores the six decision factors
- stores Aiman's baseline ratings and weights
- asks the user to choose:
  - `1` for Aiman's default profile
  - `2` for a custom profile
- computes utility scores
- computes Multinomial Logit probabilities
- prints the result table
- draws a bar chart

### Main logic

#### Aiman default mode

If the user selects `1`, the script:

- uses the hardcoded ratings matrix
- uses the hardcoded weight array
- immediately calculates results

#### Custom mode

If the user selects `2`, the script:

- asks the user to enter programme ratings from 1 to 5
- asks the user to enter factor importance values
- normalizes the weights
- calculates new utilities and probabilities

---

## Website Code

The website version is split into:

- [index.html](./index.html)
- [style.css](./style.css)
- [script.js](./script.js)

### `index.html`

This file contains:

- the structure of the web app
- the input fields
- the results table
- the chart canvas

### `style.css`

This file contains:

- page layout
- table styling
- form styling
- buttons
- responsive design for smaller screens

### `script.js`

This file contains:

- programme and factor arrays
- Aiman baseline ratings and weights
- input reading and validation
- utility calculation
- probability calculation
- result rendering
- chart drawing logic
- profile mode switching

---

## Model Assumptions

This model is based on the following assumptions:

1. **One final choice only**  
   The student chooses only one programme from the available alternatives.

2. **Mutually exclusive alternatives**  
   Choosing one programme means the others are not chosen.

3. **Finite choice set**  
   Only the six listed programmes are included in the model.

4. **Utility depends on measurable attributes**  
   Each programme is evaluated through factor scores such as interest, fees, and career prospects.

5. **Higher utility means stronger preference**  
   A programme with a larger utility value is more attractive.

6. **Weights represent factor importance**  
   The model assumes that some factors matter more than others.

7. **Probabilistic decision-making**  
   Even if one programme has the highest utility, the model still expresses the result as a probability instead of a certainty.

8. **Simplified human behavior**  
   The model does not include all real-life influences such as parental pressure, social image, emotional uncertainty, peer advice, or sudden changes in life goals.

9. **Scores are treated consistently**  
   The model assumes that a score of `5` always means a stronger positive evaluation than `4`, and so on.

10. **Multinomial Logit structure**  
   The probability formula assumes programme choices can be compared through relative utility values.

---

## Demonstrating How Different Profiles Lead to Different Outcomes

Different student profiles lead to different decisions because the factor weights and programme ratings change the utility of each alternative.

Below is a conceptual example showing how extreme preferences can shift the likely decision outcome.

| Profile Category | Strongest Preference Pattern | Likely Programme Direction | Reason |
|---|---|---|---|
| Career-driven student | Very high weight on career prospects | Engineering or Accounting | These programmes become stronger when future jobs and salary matter most |
| Science-loving student | Very high interest in science fields | Pure Sciences or Applied Sciences | Strong personal attraction to science increases these utilities |
| Budget-conscious student | Very high sensitivity to affordable fees | Accounting, Management, or whichever option is rated cheaper by the user | Lower-cost options gain more utility when spending is a major concern |
| Prestige and technical student | High exam readiness and high career focus | Engineering | Strong technical qualification and strong career emphasis favor Engineering |
| Home-oriented student | Very high weight on location | Management or Arts if rated closer/preferred | Nearby or convenient campuses gain an advantage |
| Curious explorer | Very high weight on explore | Arts or Applied Sciences if rated high on exploration | Programmes seen as broader or more flexible become more attractive |
| Safe-choice student | High exam match and stable moderate weighting | Applied Sciences or Accounting | Students may prefer programmes that feel achievable and balanced |
| Passion-first student | Very high interest, lower concern about fees | Pure Sciences or Arts depending on taste | Strong personal liking can dominate more practical concerns |

### Variable-by-Variable Extreme Outcome Explanation

| Variable | If This Variable Is Extremely Important | Decision Pattern That May Appear |
|---|---|---|
| Interest | The student mostly follows what they genuinely like | A personally loved field becomes the top choice even if it is less convenient |
| Exam Results | The student strongly prefers programmes they clearly qualify for | Programmes with high academic match become safer and more likely choices |
| Career | The student prioritises jobs, salary, and employability | Engineering and Accounting tend to rise because they often look more career-secure |
| Location | The student wants convenience or to stay close to home | Programmes attached to preferred or nearby locations become more attractive |
| Fees | The student wants the most affordable option | Lower-cost or less financially stressful choices rise in probability |
| Explore | The student wants something new or different | Broader or less traditional options can become more appealing |

### Interpretation

This demonstrates an important idea in discrete choice modeling:

- the same set of programmes can produce different outcomes
- different students assign different meanings to the same factors
- changing weights or ratings changes the final choice probabilities

So the model is not only useful for Aiman. It can also be used to compare many different student profiles and simulate how preferences affect programme decisions.

---

## How to Run the Website Locally

Open [index.html](./index.html) in a browser.

You can:

- use Aiman's default profile
- switch to custom mode
- change ratings and weights
- run the model
- observe the utility table and probability chart

---

## How to Deploy on GitHub Pages

1. Upload these files to a GitHub repository:
   - `index.html`
   - `style.css`
   - `script.js`

2. Open the repository on GitHub.

3. Go to:
   `Settings > Pages`

4. Under **Build and deployment**:
   - set **Source** to `Deploy from a branch`
   - choose the main branch
   - choose the root folder `/`

5. Save the settings.

6. GitHub Pages will generate a public website link.

---

## Summary

This project demonstrates how a discrete choice model can be used to:

- measure programme attractiveness through utility
- convert utility into probability
- compare multiple alternatives
- simulate different student profiles
- support academic and policy decision analysis

The model is simple, interpretable, and suitable for illustrating how personal preferences and practical constraints affect educational choices.
