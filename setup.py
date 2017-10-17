from setuptools import setup

exec (open('sd_range_slider/version.py').read())

setup(
    name='sd_range_slider',
    version=__version__,
    author='StratoDem',
    packages=['sd_range_slider'],
    include_package_data=True,
    license='MIT',
    description='A range slider with compressed page usage',
    install_requires=[]
)
