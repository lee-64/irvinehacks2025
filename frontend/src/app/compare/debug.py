# Debug script to check dataset headers
import pandas as pd

dataset_path = '/Users/danielyang/VSCodeProjects/irvinehacks2025/frontend/src/app/compare/cali_dataset.csv'  # Update with the correct path
dataset = pd.read_csv(dataset_path)

print("Available Headers in Dataset:")
print(dataset.columns.tolist())