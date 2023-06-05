import pandas as pd

cars=pd.DataFrame({'brand':['BMW','Ford','Toyota','Honda','KIA','BYD','Tesla','Hyundai','Chevrolete','GM','Volkswagen','Cherry'],
                  'Country':['German','US','Japan','Japan','Korea','China','US','Korea','US','US','German','China']})

cars.head(9)

s.replace(" ", "")

import unittest

class TestSetOne(unittest.TestCase):
    
    #example one test whether 2+2 is equal to 4
    #should be true
    def test_arithmetic_pass(self):
        self.assertEqual(2+2,4)

    #example two test whether 1 is in [1,2,3,4,5]
    #should be true
    def test_list_element(self):
        self.assertIn(1,[1,2,3,4,5])