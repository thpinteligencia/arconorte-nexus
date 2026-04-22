import sys
import os
import unittest

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from server.services.ipe_engine import IPEEngine

class TestIPEEngine(unittest.TestCase):
    def test_calculate_metrics_basic(self):
        soja_preds = [
            {"date": "Jan", "soja": 1000, "fob": 100},
            {"date": "Feb", "soja": 2000, "fob": 200},
            {"date": "Mar", "soja": 1500, "fob": 150},
            {"date": "Apr", "soja": 1000, "fob": 100},
            {"date": "May", "soja": 1000, "fob": 100},
            {"date": "Jun", "soja": 1000, "fob": 100},
            {"date": "Jul", "soja": 1000, "fob": 100},
            {"date": "Aug", "soja": 1000, "fob": 100},
            {"date": "Sep", "soja": 1000, "fob": 100},
            {"date": "Oct", "soja": 1000, "fob": 100},
            {"date": "Nov", "soja": 1000, "fob": 100},
            {"date": "Dec", "soja": 1000, "fob": 100},
        ]
        capacity = 10000
        
        results = IPEEngine.calculate_metrics(soja_preds, capacity)
        
        self.assertEqual(results["overallIPE"], 20.0) # (2000 / 10000) * 100
        self.assertEqual(results["picoTotal"], 2000)
        self.assertEqual(len(results["chartData"]), 12)
        self.assertEqual(results["chartData"][1]["ipe"], 20.0)

if __name__ == "__main__":
    unittest.main()
