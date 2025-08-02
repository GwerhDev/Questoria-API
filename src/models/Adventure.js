const supabase = require('../integrations/supabase');

const TABLE_NAME = 'adventures';
const JUNCTION_TABLE_NAME = 'adventure_quests';

const Adventure = {
  async create(adventureData) {
    const { quests, createdBy, ...rest } = adventureData;
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({ ...rest, created_by_user_id: createdBy })
      .select();
    if (error) throw error;

    const newAdventure = data[0];

    if (quests && quests.length > 0) {
      const questLinks = quests.map(questId => ({
        adventure_id: newAdventure.id,
        quest_id: questId,
      }));
      const { error: linkError } = await supabase
        .from(JUNCTION_TABLE_NAME)
        .insert(questLinks);
      if (linkError) throw linkError;
    }

    return newAdventure;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(`
        *,
        quests:adventure_quests(quest_id)
      `)
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    if (data) {
      data.quests = data.quests.map(q => q.quest_id);
    }
    return data;
  },

  async findAll() {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*');
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { quests, createdBy, ...rest } = updates;
    const updatePayload = { ...rest };
    if (createdBy) {
      updatePayload.created_by_user_id = createdBy;
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updatePayload)
      .eq('id', id)
      .select();
    if (error) throw error;

    const updatedAdventure = data[0];

    if (quests !== undefined) {
      // Remove existing links
      const { error: deleteError } = await supabase
        .from(JUNCTION_TABLE_NAME)
        .delete()
        .eq('adventure_id', id);
      if (deleteError) throw deleteError;

      // Add new links
      if (quests && quests.length > 0) {
        const questLinks = quests.map(questId => ({
          adventure_id: updatedAdventure.id,
          quest_id: questId,
        }));
        const { error: insertError } = await supabase
          .from(JUNCTION_TABLE_NAME)
          .insert(questLinks);
        if (insertError) throw insertError;
      }
    }

    return updatedAdventure;
  },

  async delete(id) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async findByCreatedBy(userId) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('created_by_user_id', userId);
    if (error) throw error;
    return data;
  },
};

module.exports = Adventure;