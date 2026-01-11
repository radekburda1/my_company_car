import mongoose, { Document, Schema } from 'mongoose';

export interface IAppSettings extends Document {
  signUpAllowed: boolean;
}

const AppSettingsSchema: Schema = new Schema({
  signUpAllowed: { type: Boolean, default: true }
});

export default mongoose.model<IAppSettings>('AppSettings', AppSettingsSchema, 'app_settings');
