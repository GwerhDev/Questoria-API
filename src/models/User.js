const supabase = require('../integrations/supabase');

const TABLE_NAME = 'users';

const User = {
  async findByEmail(email) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('email', email)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 means no rows found
    return data;
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

  async create(userData) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(userData)
      .select();
    if (error) throw error;
    return data[0];
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

  // You might need more specific queries based on your application's needs
  // For example, to find users by googleId:
  async findByGoogleId(googleId) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('google_id', googleId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
};

module.exports = User;