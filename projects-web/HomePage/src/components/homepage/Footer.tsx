import React from 'react';
export function Footer() {
  const columns = [{
    title: 'Product',
    links: ['Features', 'Pricing', 'Integrations', 'API Documentation', "What's New"]
  }, {
    title: 'Resources',
    links: ['Help Center', 'Community Forum', 'Blog', 'Case Studies', 'TEF Specification']
  }, {
    title: 'Company',
    links: ['About Us', 'Careers', 'Press', 'Contact']
  }, {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR', 'Security']
  }];
  return <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {columns.map((col, index) => <div key={index}>
              <h3 className="text-white font-bold mb-4">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link, i) => <li key={i}>
                    <a href="#" className="hover:text-cyan-400 transition-colors">
                      {link}
                    </a>
                  </li>)}
              </ul>
            </div>)}
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">4 Projects.ai</span>
          </div>

          <div className="text-sm">Copyright © 2025 4 Projects Inc.</div>

          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-white transition-colors">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>;
}