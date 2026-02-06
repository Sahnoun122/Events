"use client";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header de bienvenue */}
      <div className="glass-effect p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-primary-800 mb-2">
          Bienvenue, {user.fullName} ! 👋
        </h1>
        <p className="text-primary-600">
          Voici un aperçu de vos activités récentes sur EventsPro
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Événements créés", value: "12", icon: "📅", color: "bg-blue-100 text-blue-800" },
          { title: "Participants totaux", value: "234", icon: "👥", color: "bg-green-100 text-green-800" },
          { title: "Réservations", value: "89", icon: "🎫", color: "bg-purple-100 text-purple-800" },
          { title: "Revenus ce mois", value: "€2,450", icon: "💰", color: "bg-yellow-100 text-yellow-800" }
        ].map((stat, index) => (
          <div key={index} className="glass-effect p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-600">{stat.title}</p>
                <p className="text-2xl font-bold text-primary-800">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Événements récents */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Événements à venir */}
        <div className="glass-effect p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-primary-800 mb-4">Événements à venir</h2>
          <div className="space-y-4">
            {[
              {
                title: "Conférence Marketing Digital",
                date: "15 févr. 2026",
                participants: 45,
                status: "confirmé"
              },
              {
                title: "Workshop Design UX",
                date: "22 févr. 2026",
                participants: 28,
                status: "en_attente"
              },
              {
                title: "Meetup Entrepreneurs",
                date: "1 mars 2026",
                participants: 67,
                status: "confirmé"
              }
            ].map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-primary-200">
                <div>
                  <h3 className="font-medium text-primary-800">{event.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-primary-600">
                    <span>📅 {event.date}</span>
                    <span>👥 {event.participants} participants</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  event.status === 'confirmé' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.status === 'confirmé' ? 'Confirmé' : 'En attente'}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 btn-secondary text-center">
            Voir tous les événements
          </button>
        </div>

        {/* Actions rapides */}
        <div className="glass-effect p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-primary-800 mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <button className="w-full btn-primary flex items-center justify-center space-x-2">
              <span>➕</span>
              <span>Créer un nouvel événement</span>
            </button>
            <button className="w-full btn-secondary flex items-center justify-center space-x-2">
              <span>👥</span>
              <span>Gérer les participants</span>
            </button>
            <button className="w-full btn-secondary flex items-center justify-center space-x-2">
              <span>📊</span>
              <span>Voir les analytics</span>
            </button>
            <button className="w-full btn-secondary flex items-center justify-center space-x-2">
              <span>💳</span>
              <span>Gérer les paiements</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications récentes */}
      <div className="glass-effect p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-primary-800 mb-4">Notifications récentes</h2>
        <div className="space-y-3">
          {[
            {
              message: "Nouvelle inscription à votre événement 'Conférence Marketing Digital'",
              time: "Il y a 2 heures",
              type: "success"
            },
            {
              message: "Rappel: Votre événement 'Workshop Design UX' commence dans 3 jours",
              time: "Il y a 5 heures",
              type: "warning"
            },
            {
              message: "Paiement reçu pour l'événement 'Meetup Entrepreneurs'",
              time: "Il y a 1 jour",
              type: "success"
            }
          ].map((notification, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-primary-200">
              <div className={`p-2 rounded-full ${
                notification.type === 'success' ? 'bg-green-100 text-green-600' 
                : notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600'
                : 'bg-blue-100 text-blue-600'
              }`}>
                {notification.type === 'success' ? '✅' : notification.type === 'warning' ? '⚠️' : 'ℹ️'}
              </div>
              <div className="flex-1">
                <p className="text-primary-800">{notification.message}</p>
                <p className="text-sm text-primary-500">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 btn-secondary text-center">
          Voir toutes les notifications
        </button>
      </div>
    </div>
  );
}