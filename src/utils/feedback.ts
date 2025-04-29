import { toast } from "@/components/ui/use-toast";

type FeedbackType = "success" | "error" | "info" | "warning";

interface FeedbackOptions {
  title?: string;
  description?: string;
  duration?: number;
}

// Standardtexte basierend auf dem Aktionstyp und dem Erfolg/Misserfolg
const defaultMessages = {
  save: {
    success: {
      title: "Erfolgreich gespeichert",
      description: "Deine Änderungen wurden gespeichert."
    },
    error: {
      title: "Fehler beim Speichern",
      description: "Deine Änderungen konnten nicht gespeichert werden."
    }
  },
  upload: {
    success: {
      title: "Upload erfolgreich",
      description: "Die Datei wurde erfolgreich hochgeladen."
    },
    error: {
      title: "Fehler beim Hochladen",
      description: "Die Datei konnte nicht hochgeladen werden."
    }
  },
  delete: {
    success: {
      title: "Erfolgreich gelöscht",
      description: "Das Element wurde erfolgreich gelöscht."
    },
    error: {
      title: "Fehler beim Löschen",
      description: "Das Element konnte nicht gelöscht werden."
    }
  },
  login: {
    success: {
      title: "Erfolgreich angemeldet",
      description: "Du bist jetzt angemeldet."
    },
    error: {
      title: "Anmeldung fehlgeschlagen",
      description: "Die Anmeldung ist fehlgeschlagen. Bitte überprüfe deine Anmeldedaten."
    }
  },
  logout: {
    success: {
      title: "Erfolgreich abgemeldet",
      description: "Du wurdest erfolgreich abgemeldet."
    },
    error: {
      title: "Abmeldung fehlgeschlagen",
      description: "Die Abmeldung ist fehlgeschlagen."
    }
  },
  reset: {
    success: {
      title: "Erfolgreich zurückgesetzt",
      description: "Die Einstellungen wurden zurückgesetzt."
    },
    error: {
      title: "Fehler beim Zurücksetzen",
      description: "Die Einstellungen konnten nicht zurückgesetzt werden."
    }
  },
  profile: {
    success: {
      title: "Profil aktualisiert",
      description: "Dein Profil wurde erfolgreich aktualisiert."
    },
    error: {
      title: "Fehler beim Aktualisieren",
      description: "Dein Profil konnte nicht aktualisiert werden."
    }
  },
  avatar: {
    success: {
      title: "Profilbild aktualisiert",
      description: "Dein Profilbild wurde erfolgreich aktualisiert."
    },
    error: {
      title: "Fehler beim Aktualisieren",
      description: "Dein Profilbild konnte nicht aktualisiert werden."
    }
  },
  settings: {
    success: {
      title: "Einstellungen gespeichert",
      description: "Deine Einstellungen wurden erfolgreich gespeichert."
    },
    error: {
      title: "Fehler beim Speichern",
      description: "Deine Einstellungen konnten nicht gespeichert werden."
    }
  }
};

/**
 * Einheitliches System-Feedback über Toast-Nachrichten
 */
export const showFeedback = (
  type: FeedbackType,
  action: keyof typeof defaultMessages,
  options?: FeedbackOptions
) => {
  const defaultOption = 
    type === "success" ? defaultMessages[action].success : 
    type === "error" ? defaultMessages[action].error :
    { title: "", description: "" };

  toast({
    title: options?.title || defaultOption.title,
    description: options?.description || defaultOption.description,
    duration: options?.duration || 3000,
    ...(type === "error" && { variant: "destructive" })
  });
};

/**
 * Erfolgs-Feedback
 */
export const showSuccess = (action: keyof typeof defaultMessages, options?: FeedbackOptions) => {
  showFeedback("success", action, options);
};

/**
 * Fehler-Feedback
 */
export const showError = (action: keyof typeof defaultMessages, options?: FeedbackOptions) => {
  showFeedback("error", action, options);
};

/**
 * Info-Feedback
 */
export const showInfo = (title: string, description?: string, duration?: number) => {
  toast({
    title,
    description,
    duration: duration || 3000
  });
};

/**
 * Warnungs-Feedback
 */
export const showWarning = (title: string, description?: string, duration?: number) => {
  toast({
    title,
    description,
    duration: duration || 4000,
    variant: "destructive"
  });
}; 