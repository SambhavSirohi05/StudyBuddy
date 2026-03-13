import { StudyNotes } from "@/types";

export const MOCK_BST_NOTES: StudyNotes = {
    topic: "Binary Search Tree (BST) – Insertion, Deletion, Traversal",
    subtopics: [
        {
            title: "1. Concept & Structure",
            explanation: "A **Binary Search Tree (BST)** is a binary tree where for every node, the values in the left subtree are smaller, and values in the right subtree are larger. This property allows for efficient searching, insertion, and deletion operations (O(log n) on average).",
            diagrams: [
                {
                    diagram_title: "Valid vs Invalid BST",
                    diagram_type: "mermaid",
                    diagram_code: `graph TD
    subgraph Valid_BST
    A((10)) --> B((5))
    A --> C((15))
    B --> D((2))
    B --> E((7))
    end
    subgraph Invalid_BST
    X((10)) --> Y((5))
    X --> Z((15))
    Y --> W((12)):::error
    end
    classDef error fill:#ffcccc,stroke:#ff0000;`,
                    diagram_explanation: "**Valid BST:** All left children < parent < right children. **Invalid BST:** Node 12 is in the left subtree of 10 but is > 10."
                }
            ]
        },
        {
            title: "2. Insertion Operation",
            explanation: "To insert a value **V**: Start at root. If V < Current, move Left. If V > Current, move Right. Repeat until a NULL position is found, then insert V there.\n\n```python\ndef insert(root, key):\n    if root is None:\n        return Node(key)\n    if key < root.val:\n        root.left = insert(root.left, key)\n    else:\n        root.right = insert(root.right, key)\n    return root\n```",
            diagrams: [
                {
                    diagram_title: "Insert 8 into BST",
                    diagram_type: "mermaid",
                    diagram_code: `graph TD
    A((10)) --> B((5))
    A --> C((15))
    B --> D((2))
    B --> E((7))
    E -.-> F((8)):::new
    classDef new fill:#ccffcc,stroke:#00aa00,stroke-width:2px;`,
                    diagram_explanation: "Path: 10 > 8 (Left) -> 5 < 8 (Right) -> 7 < 8 (Right) -> Insert 8."
                }
            ]
        },
        {
            title: "3. Traversal Techniques",
            explanation: "Standard ways to visit all nodes: **Inorder** (Left-Root-Right, sorted output), **Preorder** (Root-Left-Right, for copying), **Postorder** (Left-Right-Root, for deletion).",
            diagrams: [
                {
                    diagram_title: "Traversal Order",
                    diagram_type: "mermaid",
                    diagram_code: `graph TD
    root((10)) --> L((5))
    root --> R((15))
    L --> LL((2))
    L --> LR((7))
    style root fill:#f9f,stroke:#333
    style L fill:#bbf,stroke:#333
    style R fill:#bbf,stroke:#333`,
                    diagram_explanation: "**Inorder:** 2 -> 5 -> 7 -> 10 -> 15 (Sorted!)\\n**Preorder:** 10 -> 5 -> 2 -> 7 -> 15\\n**Postorder:** 2 -> 7 -> 5 -> 15 -> 10"
                }
            ]
        }
    ],
    comparison_table: {
        title: "BST vs AVL Tree vs Red-Black Tree",
        columns: ["BST", "AVL Tree", "Red-Black Tree"],
        rows: [
            { aspect: "Insertion Time", values: ["O(log n) avg, O(n) worst", "O(log n)", "O(log n)"] },
            { aspect: "Search Time", values: ["O(log n) avg, O(n) worst", "O(log n) (Faster)", "O(log n) (Slightly slower than AVL)"] },
            { aspect: "Balance Condition", values: ["None", "Strict (Height diff ≤ 1)", "Loose (Black Node limits)"] },
            { aspect: "Use Case", values: ["General simple data", "Read-heavy operations", "Write-heavy operations (e.g. Map in Java)"] }
        ]
    },
    exam_notes: [
        "Height of a balanced BST is O(log n).",
        "Worst-case logic (skewed tree) makes operations O(n).",
        "Inorder traversal of a BST ALWAYS yields sorted sequence."
    ],
    common_mistakes: [
        "Confusing BST with Binary Heap (Heap structure property is different).",
        "Forgetting to handle the case where the deleted node has two children (need Inorder Successor).",
        "Assuming O(log n) time complexity without mentioning 'Average Case' or 'Balanced'."
    ],
    revision_tips: [
        "Practice calculating Inorder/Preorder/Postorder manually.",
        "Remember: Left < Root < Right."
    ]
};

export async function generateStudyNotes(prompt: string): Promise<StudyNotes> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return MOCK_BST_NOTES;
}
