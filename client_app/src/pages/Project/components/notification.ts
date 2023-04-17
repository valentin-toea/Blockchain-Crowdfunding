import { supabase } from "../../../supabaseClient";

export const addNotification = async (projectId: string) => {
    const { data: backers, error: errorBig } = await supabase
      .from("backedCampaigns")
      .select("userId")
      .eq("projectId", projectId);

    const { data: projectData, error: error2 } = await supabase
      .from("projects")
      .select("title, userId")
      .eq("id", projectId)
      .single();

    const { data: notif, error: error3 } = await supabase
      .from("notifications")
      .insert({
        message: `Campaign ${projectData.title} has reached its goal`,
        userId: [...(backers || []).map((backer) => backer.userId), projectData.userId],
        projectId,
      })
      .eq("projectId", projectId);
  };