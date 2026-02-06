"use client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-beige">
      {/* Header Navigation */}
      <header className="glass-effect sticky top-0 z-50">
        <nav className="section-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-primary-800">EventsPro</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#accueil" className="text-primary-700 hover:text-primary-800 font-medium transition-colors">
                Accueil
              </Link>
              <Link href="#services" className="text-primary-700 hover:text-primary-800 font-medium transition-colors">
                Services
              </Link>
              <Link href="#events" className="text-primary-700 hover:text-primary-800 font-medium transition-colors">
                Événements
              </Link>
              <Link href="#contact" className="text-primary-700 hover:text-primary-800 font-medium transition-colors">
                Contact
              </Link>
              <div className="flex items-center space-x-3">
                <Link href="/auth/login" className="btn-secondary">
                  Connexion
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  S&apos;inscrire
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-primary-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-primary-200">
              <div className="flex flex-col space-y-3 pt-4">
                <Link href="#accueil" className="text-primary-700 hover:text-primary-800 font-medium py-2">
                  Accueil
                </Link>
                <Link href="#services" className="text-primary-700 hover:text-primary-800 font-medium py-2">
                  Services
                </Link>
                <Link href="#events" className="text-primary-700 hover:text-primary-800 font-medium py-2">
                  Événements
                </Link>
                <Link href="#contact" className="text-primary-700 hover:text-primary-800 font-medium py-2">
                  Contact
                </Link>
                <div className="flex flex-col space-y-2 pt-2">
                  <Link href="/auth/login" className="btn-secondary text-center">
                    Connexion
                  </Link>
                  <Link href="/auth/register" className="btn-primary text-center">
                    S&apos;inscrire
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="accueil" className="section-container py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-900 mb-6 leading-tight">
            Organisez des événements
            <span className="block text-primary-600">exceptionnels</span>
          </h1>
          <p className="text-xl text-primary-700 mb-8 max-w-2xl mx-auto">
            Plateforme professionnelle de gestion d&apos;événements. Créez, gérez et participez à des événements mémorables avec facilité et élégance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login" className="btn-primary text-lg px-8 py-4">
              Commencer maintenant
            </Link>
            <Link href="#services" className="btn-secondary text-lg px-8 py-4">
              Découvrir nos services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-container py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            Nos Services
          </h2>
          <p className="text-lg text-primary-700 max-w-2xl mx-auto">
            Une solution complète pour tous vos besoins en organisation d&apos;événements
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "📅",
              title: "Planification d'événements",
              description: "Outils avancés pour planifier et organiser vos événements de A à Z"
            },
            {
              icon: "🎫",
              title: "Gestion des réservations",
              description: "Système intelligent de réservations et de gestion des participants"
            },
            {
              icon: "📊",
              title: "Analytics & Rapports",
              description: "Tableaux de bord détaillés et analyses complètes de vos événements"
            }
          ].map((service, index) => (
            <div key={index} className="glass-effect p-8 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-primary-800 mb-3">{service.title}</h3>
              <p className="text-primary-600">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="section-container py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            Événements à venir
          </h2>
          <p className="text-lg text-primary-700 max-w-2xl mx-auto">
            Découvrez les prochains événements organisés sur notre plateforme
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Conférence Tech 2026",
              date: "15 Mars 2026",
              location: "Paris, France",
              participants: "250+"
            },
            {
              title: "Workshop Design UX",
              date: "22 Mars 2026",
              location: "Lyon, France",
              participants: "50+"
            },
            {
              title: "Meetup Entrepreneurs",
              date: "30 Mars 2026",
              location: "Marseille, France",
              participants: "100+"
            }
          ].map((event, index) => (
            <div key={index} className="glass-effect p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="h-32 bg-gradient-to-br from-primary-200 to-primary-300 rounded-lg mb-4"></div>
              <h3 className="text-lg font-bold text-primary-800 mb-2">{event.title}</h3>
              <div className="space-y-1 text-primary-600">
                <p className="flex items-center">
                  <span className="w-4 h-4 mr-2">📅</span>
                  {event.date}
                </p>
                <p className="flex items-center">
                  <span className="w-4 h-4 mr-2">📍</span>
                  {event.location}
                </p>
                <p className="flex items-center">
                  <span className="w-4 h-4 mr-2">👥</span>
                  {event.participants} participants
                </p>
              </div>
              <button className="w-full mt-4 btn-primary text-sm">
                Voir détails
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-container py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            Contactez-nous
          </h2>
          <p className="text-lg text-primary-700 mb-8">
            Vous avez des questions ? Notre équipe est là pour vous aider.
          </p>
          
          <div className="glass-effect p-8 rounded-2xl">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <input
                type="text"
                placeholder="Sujet"
                className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <textarea
                placeholder="Votre message"
                rows={5}
                className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              ></textarea>
              <button type="submit" className="w-full btn-primary">
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-800 text-white py-12">
        <div className="section-container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-primary-800 font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-bold">EventsPro</span>
              </div>
              <p className="text-primary-200">
                La plateforme professionnelle pour organiser des événements exceptionnels.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-primary-200">
                <li><Link href="#" className="hover:text-white transition-colors">Planification</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Réservations</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Analytics</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-primary-200">
                <li><Link href="#" className="hover:text-white transition-colors">Centre d&apos;aide</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Suivez-nous</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-primary-200 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-primary-200 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-primary-200 hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-700 mt-8 pt-8 text-center text-primary-200">
            <p>&copy; 2026 EventsPro. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
