import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
API_DIR = ROOT / "api"

for path in [str(ROOT), str(API_DIR)]:
    if path not in sys.path:
        sys.path.insert(0, path)

try:
    from .handler import app
except ImportError:
    from handler import app
