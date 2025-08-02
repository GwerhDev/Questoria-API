const supabase = require('../integrations/supabase');

const TABLE_NAME = 'rewards';

const Reward = {
  async create(rewardData) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(rewardData)
      .select();
    if (error) throw error;
    return data[0];
  },

  async findById(id) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
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
};

module.exports = Reward;