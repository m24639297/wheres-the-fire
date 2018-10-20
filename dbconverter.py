import node
import numpy as np
import csv
import pandas
from enum import IntEnum

class Maze:
    def __init__(self, filepath):
        self.raw_data = pandas.read_csv(filepath).values
        self.nodes = []
        self.nd_dict = [] # key: index, value: the correspond node
        self.explored = set()
        self.all_end_nodes = [] 
        self.all_end_len = []

        for i in range(len(self.raw_data)):
            aaa=node.Node(i+1)
            self.nodes.append(aaa)

        for dt in self.raw_data:

            for i in range(1,5):
                if not np.isnan(dt[i]):
                    self.nodes[int(dt[0])-1].setSuccessor(int(dt[i]), i ,dt[i+4])

        self.nd_dict=self.nodes.copy()

            #TODO: Update the nodes with the information from raw_data

            #TODO: Update the successors for each node

