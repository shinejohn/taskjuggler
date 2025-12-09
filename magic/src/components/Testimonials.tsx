import React from 'react';
import { StarIcon } from 'lucide-react';
export function Testimonials() {
  const testimonials = [{
    quote: 'Task Juggler has transformed how our law firm manages client interactions. No more lost emails or missed follow-ups.',
    author: 'Sarah Johnson',
    role: 'Managing Partner, Johnson Legal',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    stars: 5
  }, {
    quote: 'As a contractor, keeping track of service calls was a nightmare before Task Juggler. Now clients set their own timelines and everything is clear.',
    author: 'Mike Rodriguez',
    role: 'Owner, Rodriguez Plumbing',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    stars: 5
  }, {
    quote: 'The AI assistant is incredible - it turns my emails into perfectly structured tasks automatically. Huge time saver!',
    author: 'Lisa Chen',
    role: 'Executive Assistant, TechCorp',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    stars: 5
  }];
  return <section id="testimonials" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-700">
            Professionals across industries are transforming how they work with
            Task Juggler.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[...Array(testimonial.stars)].map((_, i) => <StarIcon key={i} size={20} className="text-yellow-500 fill-current" />)}
              </div>
              <blockquote className="text-gray-700 mb-6">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center">
                <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <div className="font-medium text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
}