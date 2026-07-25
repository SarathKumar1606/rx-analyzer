import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import resolve_model_name


class ResolveModelNameTests(unittest.TestCase):
    def test_prefers_explicit_env_model(self):
        os.environ['GROQ_MODEL'] = 'llama-3.1-8b-instant'
        self.assertEqual(resolve_model_name(), 'llama-3.1-8b-instant')

    def test_uses_fallback_when_env_missing(self):
        os.environ.pop('GROQ_MODEL', None)
        self.assertIn(resolve_model_name(), ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'])


if __name__ == '__main__':
    unittest.main()
