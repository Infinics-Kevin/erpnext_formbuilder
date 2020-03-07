# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in erpnext_formbuilder/__init__.py
from erpnext_formbuilder import __version__ as version

setup(
	name='erpnext_formbuilder',
	version=version,
	description='GUI Form Builder for ERPNext',
	author='Havenir Solutions',
	author_email='info@havenir.com',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)