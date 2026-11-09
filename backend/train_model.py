from math import ceil
from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import Pipeline


BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = BASE_DIR / "datasets"
DATASETS = {
    "combined_data": DATASET_DIR / "Combined Data.csv",
    "mental_health": DATASET_DIR / "Mental_health.csv",
}


def _build_pipeline():
    return Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    lowercase=True,
                    stop_words="english",
                    max_features=5000,
                ),
            ),
            (
                "classifier",
                MLPClassifier(
                    hidden_layer_sizes=(20,),
                    max_iter=300,
                    random_state=42,
                    verbose=True,
                ),
            ),
        ]
    )


def _load_dataset(dataset_path):
    dataset_path = Path(dataset_path)
    if not dataset_path.exists():
        raise FileNotFoundError(f"Dataset not found: {dataset_path}")

    print(f"Loading {dataset_path}...")
    dataset = pd.read_csv(dataset_path, usecols=["statement", "status"])
    dataset = dataset.rename(columns={"statement": "text", "status": "intent"})
    dataset = dataset.dropna(subset=["text", "intent"])
    dataset["text"] = dataset["text"].astype(str).str.strip()
    dataset["intent"] = dataset["intent"].astype(str).str.strip().str.lower()
    return dataset[(dataset["text"] != "") & (dataset["intent"] != "")]


def _split_dataset(dataset, dataset_path):
    label_counts = dataset["intent"].value_counts()
    class_count = len(label_counts)
    validation_size = max(ceil(len(dataset) * 0.2), class_count)
    dataset_name = Path(dataset_path).name

    if class_count < 2:
        raise ValueError(f"{dataset_name} must contain at least two intent classes.")
    if (label_counts < 2).any() or len(dataset) - validation_size < class_count:
        raise ValueError(
            f"{dataset_name} needs enough examples of every intent to create "
            "a stratified training and validation split."
        )

    return train_test_split(
        dataset["text"],
        dataset["intent"],
        test_size=validation_size,
        random_state=42,
        stratify=dataset["intent"],
    )


def train_intent_model():
    validation_accuracies = {}

    for model_name, dataset_path in DATASETS.items():
        dataset_name = Path(dataset_path).name
        dataset = _load_dataset(dataset_path)
        print(
            f"{dataset_name}: {len(dataset)} examples, "
            f"{dataset['intent'].nunique()} intent classes."
        )

        print(f"Validating model for {dataset_name}...")
        train_text, validation_text, train_intents, validation_intents = (
            _split_dataset(dataset, dataset_path)
        )
        validation_model = _build_pipeline()
        validation_model.fit(train_text, train_intents)
        validation_accuracies[model_name] = validation_model.score(
            validation_text, validation_intents
        )

        print(f"Training final model for {dataset_name}...")
        model = _build_pipeline()
        model.fit(dataset["text"], dataset["intent"])

        model_path = BASE_DIR / f"intent_model_{model_name}.pkl"
        joblib.dump(model, model_path)
        print(
            f"Saved {model_path} "
            f"(validation accuracy: {validation_accuracies[model_name]:.2%})."
        )

    best_model_name = max(validation_accuracies, key=validation_accuracies.get)
    best_model_path = BASE_DIR / f"intent_model_{best_model_name}.pkl"
    joblib.dump(joblib.load(best_model_path), BASE_DIR / "intent_model.pkl")
    print(
        f"Selected {best_model_name} as the best model "
        f"({validation_accuracies[best_model_name]:.2%} validation accuracy)."
    )
    print("Training complete! Both models and the selected model were saved.")


if __name__ == "__main__":
    train_intent_model()
