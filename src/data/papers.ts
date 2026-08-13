export type Section = {
  heading: string;
  paragraphs: string[];
};

export type Paper = {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  category: string;
  tags: string[];
  abstract: string;
  readingMinutes: number;
  sections: Section[];
  references: string[];
};

export const papers: Paper[] = [
  {
    id: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    authors: ["A. Vaswani", "N. Shazeer", "N. Parmar", "et al."],
    year: 2017,
    venue: "NeurIPS",
    category: "Machine Learning",
    tags: ["transformers", "attention", "sequence modeling"],
    abstract:
      "This work introduces the Transformer, a sequence transduction architecture that relies entirely on self-attention and dispenses with recurrence and convolutions. The design enables far greater parallelism during training and reaches state-of-the-art quality on machine translation while training in a fraction of the time required by recurrent baselines.",
    readingMinutes: 12,
    sections: [
      {
        heading: "Motivation",
        paragraphs: [
          "Recurrent models process tokens sequentially, which fundamentally limits how much of the computation can be parallelized within a single training example. As sequences grow longer, this sequential dependency becomes the dominant bottleneck for both training throughput and memory.",
          "The authors ask whether attention alone—without any recurrent or convolutional structure—can capture the dependencies needed to model language. The answer reshaped the field.",
        ],
      },
      {
        heading: "The Transformer",
        paragraphs: [
          "The model follows an encoder-decoder structure where each layer is built from multi-head self-attention followed by a position-wise feed-forward network. Residual connections and layer normalization wrap each sub-layer.",
          "Because attention is order-invariant, positional encodings are added to the input embeddings so the model can reason about token order.",
        ],
      },
      {
        heading: "Results",
        paragraphs: [
          "On WMT 2014 English-to-German and English-to-French translation the Transformer set new state-of-the-art BLEU scores while requiring substantially less training compute than the best previously published models.",
          "Just as importantly, the architecture generalized: the same building blocks now underpin large language models across nearly every modality.",
        ],
      },
    ],
    references: [
      "Bahdanau et al., Neural Machine Translation by Jointly Learning to Align and Translate (2015)",
      "Cho et al., Learning Phrase Representations using RNN Encoder-Decoder (2014)",
    ],
  },
  {
    id: "deep-residual-learning",
    title: "Deep Residual Learning for Image Recognition",
    authors: ["K. He", "X. Zhang", "S. Ren", "J. Sun"],
    year: 2016,
    venue: "CVPR",
    category: "Computer Vision",
    tags: ["resnet", "deep learning", "image classification"],
    abstract:
      "Very deep networks are notoriously hard to optimize. This paper reformulates layers as learning residual functions with reference to the layer inputs, making networks with hundreds of layers easier to train and dramatically improving accuracy on ImageNet.",
    readingMinutes: 10,
    sections: [
      {
        heading: "The Degradation Problem",
        paragraphs: [
          "Empirically, simply stacking more layers eventually increases training error—not because of overfitting, but because deeper plain networks become harder to optimize.",
          "Residual learning addresses this by letting each block learn a residual mapping added to an identity shortcut, so the optimizer can more easily drive unneeded blocks toward the identity function.",
        ],
      },
      {
        heading: "Architecture",
        paragraphs: [
          "A residual block computes F(x) + x, where the shortcut connection performs identity mapping and adds no extra parameters or computation.",
          "The authors trained networks up to 152 layers deep—far deeper than prior art—while keeping complexity lower than shallower competitors.",
        ],
      },
      {
        heading: "Impact",
        paragraphs: [
          "ResNet won the ILSVRC 2015 classification task and became a default backbone for detection, segmentation, and countless downstream vision tasks.",
        ],
      },
    ],
    references: [
      "Krizhevsky et al., ImageNet Classification with Deep Convolutional Neural Networks (2012)",
      "Simonyan & Zisserman, Very Deep Convolutional Networks (2015)",
    ],
  },
  {
    id: "bert-pretraining",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: ["J. Devlin", "M.-W. Chang", "K. Lee", "K. Toutanova"],
    year: 2019,
    venue: "NAACL",
    category: "Natural Language Processing",
    tags: ["pretraining", "language models", "transfer learning"],
    abstract:
      "BERT pre-trains deep bidirectional representations by jointly conditioning on both left and right context. A masked language modeling objective plus next-sentence prediction yields representations that, with only a light task-specific head, achieve state-of-the-art results across a broad suite of language understanding benchmarks.",
    readingMinutes: 11,
    sections: [
      {
        heading: "Bidirectional Context",
        paragraphs: [
          "Earlier language models were unidirectional, reading text strictly left-to-right or right-to-left. BERT instead masks a fraction of the input tokens and trains the model to reconstruct them from the full surrounding context.",
          "This masked language modeling objective is what unlocks genuinely bidirectional representations in a deep Transformer encoder.",
        ],
      },
      {
        heading: "Fine-tuning",
        paragraphs: [
          "The same pre-trained model can be adapted to many tasks by adding a single output layer and fine-tuning end-to-end, avoiding heavily engineered task-specific architectures.",
        ],
      },
    ],
    references: [
      "Vaswani et al., Attention Is All You Need (2017)",
      "Peters et al., Deep Contextualized Word Representations (2018)",
    ],
  },
  {
    id: "adam-optimizer",
    title: "Adam: A Method for Stochastic Optimization",
    authors: ["D. Kingma", "J. Ba"],
    year: 2015,
    venue: "ICLR",
    category: "Optimization",
    tags: ["optimization", "gradient descent", "training"],
    abstract:
      "Adam is a first-order gradient-based optimizer that adapts per-parameter learning rates from estimates of the first and second moments of the gradients. It is computationally efficient, has little memory overhead, and works well across a wide range of non-convex problems.",
    readingMinutes: 8,
    sections: [
      {
        heading: "Adaptive Moments",
        paragraphs: [
          "Adam maintains exponentially decaying averages of past gradients and past squared gradients, giving each parameter its own effective step size.",
          "Bias-correction terms account for the fact that these moving averages are initialized at zero, which matters most in the early steps of training.",
        ],
      },
      {
        heading: "Why It Caught On",
        paragraphs: [
          "The default hyperparameters work robustly across many problems, which made Adam a go-to optimizer for practitioners training deep networks.",
        ],
      },
    ],
    references: [
      "Duchi et al., Adaptive Subgradient Methods (2011)",
      "Tieleman & Hinton, RMSProp lecture notes (2012)",
    ],
  },
  {
    id: "generative-adversarial-nets",
    title: "Generative Adversarial Nets",
    authors: ["I. Goodfellow", "J. Pouget-Abadie", "M. Mirza", "et al."],
    year: 2014,
    venue: "NeurIPS",
    category: "Machine Learning",
    tags: ["generative models", "gan", "unsupervised learning"],
    abstract:
      "A generative model is trained via an adversarial process in which a generator learns to produce data while a discriminator learns to tell real from generated samples. The two networks play a minimax game, and at the optimum the generator recovers the data distribution.",
    readingMinutes: 9,
    sections: [
      {
        heading: "The Adversarial Game",
        paragraphs: [
          "The generator maps random noise to samples, while the discriminator outputs the probability that a sample came from the real data rather than the generator.",
          "Training alternates between improving the discriminator and improving the generator, driving the generated distribution toward the true data distribution.",
        ],
      },
      {
        heading: "Legacy",
        paragraphs: [
          "GANs sparked a wave of research in image synthesis and remain a foundational idea in generative modeling.",
        ],
      },
    ],
    references: [
      "Kingma & Welling, Auto-Encoding Variational Bayes (2014)",
      "Goodfellow et al., Deep Learning (2016)",
    ],
  },
  {
    id: "mapreduce",
    title: "MapReduce: Simplified Data Processing on Large Clusters",
    authors: ["J. Dean", "S. Ghemawat"],
    year: 2004,
    venue: "OSDI",
    category: "Systems",
    tags: ["distributed systems", "data processing", "parallelism"],
    abstract:
      "MapReduce is a programming model and runtime for processing large data sets on commodity clusters. Users express computations as map and reduce functions, and the runtime transparently handles partitioning, scheduling, fault tolerance, and inter-machine communication.",
    readingMinutes: 10,
    sections: [
      {
        heading: "Programming Model",
        paragraphs: [
          "A map function transforms input key/value pairs into intermediate pairs, and a reduce function merges all intermediate values associated with the same key.",
          "This simple abstraction covers a surprising range of real-world data processing tasks.",
        ],
      },
      {
        heading: "Fault Tolerance at Scale",
        paragraphs: [
          "The runtime re-executes failed tasks and mitigates stragglers with backup executions, allowing reliable computation on clusters where individual machine failures are routine.",
        ],
      },
    ],
    references: [
      "Ghemawat et al., The Google File System (2003)",
      "Dean & Barroso, The Tail at Scale (2013)",
    ],
  },
];

export function getAllPapers(): Paper[] {
  return papers;
}

export function getPaperById(id: string): Paper | undefined {
  return papers.find((paper) => paper.id === id);
}

export function getCategories(): string[] {
  return Array.from(new Set(papers.map((paper) => paper.category))).sort();
}
