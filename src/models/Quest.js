const supabase = require('../integrations/supabase');

const TABLE_NAME = 'quests';

const Quest = {
  async create(questData) {
    const { reward, ...rest } = questData;
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({ ...rest, reward_id: reward })
      .select();
    if (error) throw error;
    return data[0];
  },

  async findById(id) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*, reward:rewards(*)') // Fetch reward details
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async update(id, updates) {
    const { reward, ...rest } = updates;
    const updatePayload = { ...rest };
    if (reward) {
      updatePayload.reward_id = reward;
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updatePayload)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async findByRewardId(rewardId) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('reward_id', rewardId);
    if (error) throw error;
    return data;
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

module.exports = Quest;