import re

def fix_markdown(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # MD009: Trailing spaces
    content = re.sub(r'[ \t]+$', '', content, flags=re.MULTILINE)

    # MD022/MD032: Ensure blank lines below headings
    # A heading is ^#+ . If the line below is not empty, add a newline
    content = re.sub(r'^(#+ .*)\n([^\n])', r'\1\n\n\2', content, flags=re.MULTILINE)
    
    # Ensure blank lines above headings (except first line)
    content = re.sub(r'([^\n])\n(#+ .*)', r'\1\n\n\2', content, flags=re.MULTILINE)

    # MD030: Fix list marker spacing (e.g. "*   " to "* ")
    content = re.sub(r'^(\s*[\*\-])\s+', r'\1 ', content, flags=re.MULTILINE)
    
    # MD026: No trailing punctuation in heading
    content = re.sub(r'^(#+ .*)[:.,;]$', r'\1', content, flags=re.MULTILINE)
    
    # MD036: No emphasis as heading (e.g., "**Score: 82/100**" should maybe not trigger this if we add a period or make it regular)
    # The warning says: MD036/no-emphasis-as-heading: Emphasis used instead of a heading
    # To fix, we can change **Text** to ### Text, or just add a dot at the end: **Text**.
    content = re.sub(r'^\*\*(Score:.*?)\*\*$', r'**\1**.', content, flags=re.MULTILINE)

    # Fix unordered list indentation (MD007: Unordered list indentation [Expected: 2; Actual: 4])
    # Replace 4 spaces at start of line with 2 spaces for lists.
    content = re.sub(r'^    (\*|\-)', r'  \1', content, flags=re.MULTILINE)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_markdown('crm_architecture_blueprint.md')
fix_markdown('post_implementation_audit.md')
