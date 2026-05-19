import { supabase } from "./supabaseClient";
import { getApiUrl } from "./api";

/**
 * Llama al endpoint seguro del backend para eliminar la cuenta de usuario,
 * sus audios y sus datos asociados.
 * Esto implementa el Art. 16 de la Ley 81 de Protección de Datos Personales de Panamá.
 *
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteUserAccount = async () => {
  try {
    // 1. Obtener el token de autenticación del usuario actual
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new Error("No se pudo obtener la sesión actual del usuario.");
    }

    const token = session.access_token;
    const apiUrl = getApiUrl();

    // 2. Realizar petición DELETE al backend seguro
    const response = await fetch(`${apiUrl}/users/account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || "Ocurrió un error al eliminar la cuenta.",
      );
    }

    // 3. Si todo es exitoso, retornar true
    return { success: true };
  } catch (error) {
    console.error("Error en deleteUserAccount:", error);
    return {
      success: false,
      error:
        error.message ||
        "Error de conexión con el servidor. Inténtalo más tarde.",
    };
  }
};
