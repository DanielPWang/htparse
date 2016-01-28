__author__ = 'Daniel'

class A(object):
    def __init__(self):
        self.d ={}
    def __setattr__(self, key, value):
        object.__setattr__(self, key, value)
    def __getattr__(self, item):
        return object.__getattribute__(self, item)
    def Display(self):
        print(dir(self))

a = A()
a.a = "sdfsfd"
print(a.a, a.d)
a.Display()
