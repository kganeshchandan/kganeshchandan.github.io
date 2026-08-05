# Ganesh Chandan Kanakala — Associated Public GitHub Projects

**Evidence snapshot:** 2026-08-05
**Scope:** Public repositories outside `kganeshchandan/*` with commits attributable to `kanakala.ganesh@research.iiit.ac.in`, corroborated by commit history and, where available, repository contributor files. This supplements—not replaces—the 28-repository account-owned inventory.

## Discovery and attribution method

- Searched public GitHub commit attribution for the IIIT-H research email shown in repository history.
- Inspected the complete Git history of every external repository found in the available result pages.
- Used commit timestamps for contribution chronology. These are not claimed as GitHub repository-creation dates.
- A commit count records commits matching the research email; it does not imply sole intellectual ownership of upstream methods, datasets, or papers.
- Several repositories are organization copies, course adaptations, or collaborations and are labeled accordingly.

## Summary

| Repository | First repository commit | Latest repository commit | Total commits | Ganesh-attributed commits | Classification |
|---|---:|---:|---:|---:|---|
| [`devalab/MolGPT2.0`](https://github.com/devalab/MolGPT2.0) | 2025-02-18 | 2026-07-23 | 15 | 2 | Research implementation; collaborative current repository |
| [`devalab/Protein-Ligand-Dataset-Bias`](https://github.com/devalab/Protein-Ligand-Dataset-Bias) | 2022-03-24 | 2022-06-29 | 8 | 8 | Research code; entirely attributed to Ganesh in current history |
| [`devalab/Spectra2Structure`](https://github.com/devalab/Spectra2Structure) | 2024-05-06 | 2024-07-06 | 2 | 2 | Publication-associated research implementation |
| [`D4-course/EDDTR`](https://github.com/D4-course/EDDTR) | 2022-11-30 | 2022-12-10 | 6 | 6 | Course implementation/adaptation |
| [`D4-course/Symmetry-aware-actor-critic`](https://github.com/D4-course/Symmetry-aware-actor-critic) | 2022-11-30 | 2022-12-10 | 8 | 8 | Course import/adaptation of MolGym |
| [`jai-ganesh-sankar/ML4NS`](https://github.com/jai-ganesh-sankar/ML4NS) | 2022-04-13 | 2022-05-18 | 12 | 8 | Collaborative course project |
| [`virtual-labs/exp-defects-in-crystals-iiith`](https://github.com/virtual-labs/exp-defects-in-crystals-iiith) | 2022-09-06 | 2026-01-28 | 17 | 4 | Virtual Labs collaboration; reciprocal-lattices experiment despite legacy repository slug |
| [`virtual-labs/exp-miller-indices-iiith`](https://github.com/virtual-labs/exp-miller-indices-iiith) | 2022-09-06 | 2026-01-28 | 18 | 4 | Virtual Labs collaboration; Miller-indices experiment |
| [`virtual-labs/exp-symmetries-iiith`](https://github.com/virtual-labs/exp-symmetries-iiith) | 2022-09-06 | 2026-01-28 | 32 | 16 | Virtual Labs collaboration; crystal-symmetry experiment |

All timestamps in this document preserve the commit timezone recorded by Git. Dates in the table are shortened for readability.

---

## 1. devalab/MolGPT2.0

- URL: <https://github.com/devalab/MolGPT2.0>.
- Current default branch: `main`.
- Current HEAD observed: `1b3822357e0f203ac840e21dcc623a3dcdcebff5`.
- Repository history: 15 commits from 2025-02-18 through 2026-07-23.
- Ganesh-attributed history:
  - 2025-02-18 — `f01bd4019a8aa3ed6556824348ebb13930f36d6b`, “Initial commit,” authored as **K Ganesh chandan**.
  - 2025-03-04 — `69ed99df6a015d28643051f8f090d30696128f7c`, “added codebase,” authored as **Kanakala Ganesh**.
- The second Ganesh commit added approximately 9,801 lines across 50 files, including:
  - Dockstring analysis and affinity-prediction notebooks;
  - preference-data creation scripts;
  - DPO training experiments;
  - docking and pose-visualization tools;
  - multi-property encoder–decoder implementations;
  - corpus/vocabulary builders;
  - experiment images and submission scripts.
- Later contributors in 2026 added/refined datasets, MinMaxScaler/configuration handling, reusable training/generation/DPO/analysis scripts, documentation, checkpoints, and results. Therefore, describe Ganesh as the **initial repository/codebase author and research contributor**, not sole author of the current repository state.

### Repository-stated paper

> “MolGPT2.0: Multi-objective molecule generation via transformer encoder-decoder model and direct preference optimization.”

The repository calls this a paper but does not provide a DOI, venue, or final publication status in the README.

### Current documented workflow

1. Install dependencies, with Dockstring/Open Babel recommended through conda-forge.
2. Train encoder–decoder base models conditioned on affinity or multiple properties.
3. Sample molecules and save generation metrics.
4. Perform Direct Preference Optimization using preference data.
5. Compute generated-molecule properties and produce plots.

Documented property-conditioning example:

- affinity
- LogP (`logps`)
- synthetic accessibility (`sas`)
- topological polar surface area (`tpsas`)
- quantitative estimate of drug-likeness (`qeds`)

### Public data and artifacts

- Dockstring training data: `data/lck_dockstring_data1.csv`.
- Affinity preference data: `data/PreferenceData_affinity.pkl`.
- SMILES corpus.
- Base and DPO checkpoints.
- Generated molecules, molecule images, KDE plots, property metrics, validity/novelty/uniqueness/diversity metrics.

### Metrics currently committed at temperature 1.0

| Checkpoint | Validity | Novelty | Uniqueness | Internal diversity |
|---|---:|---:|---:|---:|
| Affinity base model | 98.046875% | 94.123506% | 100% | 0.868800 |
| Affinity DPO model | 96.09375% | 100% | 100% | 0.872811 |
| Affinity + QED base model | 97.753906% | 97.302697% | 100% | 0.865967 |
| Affinity + SAS base model | 96.972656% | 100% | 100% | 0.868420 |
| Affinity + LogP base model | 97.65625% | 100% | 100% | 0.867542 |

These results refine the résumé claim that validity and novelty exceed 95%: that is true for the DPO and listed multi-property checkpoints, but the committed affinity-only base checkpoint has novelty of approximately 94.12%. The portfolio should attach metrics to the applicable model/evaluation rather than make an unqualified universal claim.

---

## 2. devalab/Protein-Ligand-Dataset-Bias

- URL: <https://github.com/devalab/Protein-Ligand-Dataset-Bias>.
- Current default branch: `master`.
- Eight commits, all attributed to Ganesh's IIIT-H research email.
- Contribution period: 2022-03-24 through 2022-06-29.
- Closely related to `kganeshchandan/dd_code` and the ACS Omega latent-bias paper.
- Contains:
  - DAVIS and KIBA split-generation scripts;
  - PDBbind folds;
  - DeepDTA reproduction;
  - modified GraphDTA scripts based on author-released code;
  - Pafnucy training/testing plus ligand-only and protein-only experiments;
  - SimCNN-DTA implementation/reproduction;
  - SMINA experiments;
  - Protein–Ligand Extended Connectivity Fingerprint experiments;
  - PocketMatch score calculations;
  - added folds for PLEC and PocketMatch.

This is a stronger public organizational repository for the binding-affinity bias research than the personal `dd_code` mirror alone.

---

## 3. devalab/Spectra2Structure

- URL: <https://github.com/devalab/Spectra2Structure>.
- Current default branch: `master`.
- Two commits, both attributed to Ganesh's IIIT-H research email.
- Contributions:
  - 2024-05-06 — initial implementation.
  - 2024-07-06 — `qm9.py` update.
- Associated with the Digital Discovery Spectra-to-Structure paper.
- README instructs users to obtain data/splits from the paper's ESI, configure raw train/validation/test pickle paths, create the environment, run `run.py`, and log results to W&B.
- A personal-namespace copy also exists at `kganeshchandan/Spectra2Structure`; treat the two URLs as copies of one research implementation, not two independent projects.

---

## 4. D4-course/EDDTR

- URL: <https://github.com/D4-course/EDDTR>.
- Six commits, all attributed to Ganesh.
- Contribution period: 2022-11-30 through 2022-12-10.
- Title: **Explainable Deep Drug-Target Representations for Binding Affinity Prediction**.
- Explores CNN reliability and input-region explanations for binding-affinity prediction.
- Implements two parallel CNNs plus a feed-forward fully connected network over protein and molecular sequence/structure representations.
- Includes:
  - chemogenomic representative K-fold splitting;
  - Regression Discriminative Localization / L-Grad-RAM;
  - global max/average pooling and guided/non-guided gradient variants;
  - DAVIS kinase-affinity data and representations;
  - protein Smith–Waterman similarity;
  - SMILES ECFP6/Tanimoto similarity;
  - sc-PDB matching and PSSM data;
  - PyMOL docking sessions for ABL1(E255K)-phosphorylated/SKI-606 and DDR1/Foretinib;
  - training, validation, evaluation, and Docker instructions;
  - project-summary video and slide deck.
- This appears inside `kganeshchandan/d4-course-projs` as well. Treat it as one course project with an organization repository and personal aggregate copy.

---

## 5. D4-course/Symmetry-aware-actor-critic

- URL: <https://github.com/D4-course/Symmetry-aware-actor-critic>.
- Eight commits, all attributed to Ganesh.
- Contribution period: 2022-11-30 through 2022-12-10.
- Course import/adaptation of **MolGym: Reinforcement Learning for 3D Molecular Design**.
- The upstream method trains RL policies that place atoms in Cartesian coordinates, with single-bag, stochastic-bag, and multi-bag experiments.
- Repository adds course-oriented Docker instructions, a summary video, and a slide deck.
- The README explicitly credits the original MolGym and Symmetry-Aware Actor-Critic authors. Portfolio wording must describe this as reproduction/adaptation/course work—not an original invention of the underlying algorithm.
- This appears as the `molgym` directory inside `kganeshchandan/d4-course-projs`.

---

## 6. jai-ganesh-sankar/ML4NS

- URL: <https://github.com/jai-ganesh-sankar/ML4NS>.
- Collaborative Machine Learning for Natural Sciences course-progress repository, Spring 2022.
- Repository history: 12 commits; eight attributed to Ganesh.
- Ganesh contribution period: 2022-04-13 through 2022-05-18.
- Commit and tree evidence includes:
  - drug–drug and chemical-similarity datasets;
  - drug target, enzyme, pathway, transporter, indication, side-effect, and off-side-effect matrices;
  - graph embedding, Node2Vec, and t-SNE work;
  - CNN, residual CNN, CRNN, and feed-forward notebooks;
  - saved models;
  - a committed filename/report indicating CNN accuracy around 0.888 and a Ganesh commit message stating best CNN/FNN accuracy of 0.89.
- Because the README supplies little task/evaluation context, keep this in the archival/course timeline unless the exact prediction task and metric are confirmed.

---

## 7. Virtual Labs experiments

All three repositories explicitly list **Ganesh Chandan** and **Jai Ganesh** as IIIT-H developers, with Dr. Prabhakar Bhimalapuram as subject-matter expert. The repositories include theory, aims, procedures, pre/post-tests, Three.js simulations, and deployment workflows.

### virtual-labs/exp-defects-in-crystals-iiith

- URL: <https://github.com/virtual-labs/exp-defects-in-crystals-iiith>.
- Legacy slug says “defects in crystals,” but current experiment content identifies it as **Reciprocal Lattices**.
- Ganesh commits: four, from 2023-01-09 through 2023-03-07.
- Contributions include initializing the experiment, bug fixes, an observation section, instructions, and canvas/toggle/slider updates.
- Experiment teaches primitive/reciprocal vectors for finite visualizations of simple cubic, body-centered cubic, face-centered cubic, and hexagonal close-packed lattices.

### virtual-labs/exp-miller-indices-iiith

- URL: <https://github.com/virtual-labs/exp-miller-indices-iiith>.
- Experiment: **Miller Indices**.
- Ganesh commits: four, from 2023-01-09 through 2023-03-07.
- Contributions include Miller-index implementation/naming, bug fixes, observation section, and canvas/toggle/slider updates.
- The simulation lets students select atoms, construct a plane, and check whether it matches selected Miller indices.

### virtual-labs/exp-symmetries-iiith

- URL: <https://github.com/virtual-labs/exp-symmetries-iiith>.
- Experiment: **Symmetries in crystal structures**.
- Ganesh commits: 16, from 2023-01-11 through 2023-11-12.
- Contributions include reference atoms, rotational controls, template testing, action handling, observation content, point/axis/plane symmetry checks, visualization, UI changes, axis rendering, overflow fixes, and ghost-rotation fixes.
- Covers simple cubic, face-centered cubic, body-centered cubic, and hexagonal close-packed lattices.

The repository histories continue into 2026 through other contributors/maintenance; that later activity is not attributed to Ganesh.

---

## Portfolio interpretation

### Flagship evidence

- `devalab/MolGPT2.0`
- `devalab/Protein-Ligand-Dataset-Bias`
- `devalab/Spectra2Structure`
- The three Virtual Labs experiments

### Course/archive evidence

- `D4-course/EDDTR`
- `D4-course/Symmetry-aware-actor-critic`
- `jai-ganesh-sankar/ML4NS`

### Duplicate/mirror relationships

- `devalab/Spectra2Structure` and `kganeshchandan/Spectra2Structure` are copies/variants of one research implementation.
- `devalab/Protein-Ligand-Dataset-Bias`, `kganeshchandan/dd_code`, and `kganeshchandan/sim-CNNDTA` belong to the same binding-affinity bias research line but contain differing experiment coverage.
- `D4-course/EDDTR` and `D4-course/Symmetry-aware-actor-critic` also appear inside the aggregate `kganeshchandan/d4-course-projs` repository.
- `kganeshchandan/3JS` is a prototype/working repository related to the later organization-hosted Virtual Labs experiments.
