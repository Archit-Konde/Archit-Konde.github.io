import re
import os

def minify_css(css):
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s?([\{\}:;,])\s?', r'\1', css)
    return css.strip()

def minify_js(js):
    # Remove single line comments (but not in URLs)
    js = re.sub(r'(?<!:)\/\/.*?\n', '\n', js)
    js = re.sub(r'/\*.*?\*/', '', js, flags=re.DOTALL)
    js = re.sub(r'\n\s+', '\n', js)
    js = re.sub(r'\s+\n', '\n', js)
    js = re.sub(r'\t', ' ', js)
    return js.strip()

base_path = r'Source Code'

# Minify CSS
css_path = os.path.join(base_path, 'styles', 'main.css')
min_css_path = os.path.join(base_path, 'styles', 'main.min.css')
if os.path.exists(css_path):
    with open(css_path, 'r', encoding='utf-8') as f:
        css_content = f.read()
    minified_css = minify_css(css_content)
    with open(min_css_path, 'w', encoding='utf-8') as f:
        f.write(minified_css)

# Minify JS
js_path = os.path.join(base_path, 'scripts', 'app.js')
min_js_path = os.path.join(base_path, 'scripts', 'app.min.js')
if os.path.exists(js_path):
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()
    minified_js = minify_js(js_content)
    with open(min_js_path, 'w', encoding='utf-8') as f:
        f.write(minified_js)
