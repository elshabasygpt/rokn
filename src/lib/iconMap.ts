import {
  Truck, Package, Box, MapPin, Navigation, Archive,
  Users, UserCheck, Briefcase, Wrench, PenTool,
  ShieldCheck, CheckCircle2, Award, Star, ThumbsUp, Heart, Lock,
  Clock, Timer, Calculator, Banknote, CreditCard, TrendingUp, Zap,
  Phone, Mail, MessageCircle, Home, Settings, Info, Globe,
  Headset, ThumbsUp as Like, CarFront, Snowflake, Compass, Move, Calendar
} from 'lucide-react';

export const availableIcons: Record<string, any> = {
  Truck, Package, Box, MapPin, Navigation, Archive,
  Users, UserCheck, Briefcase, Wrench, PenTool,
  ShieldCheck, CheckCircle2, Award, Star, ThumbsUp, Heart, Lock,
  Clock, Timer, Calculator, Banknote, CreditCard, TrendingUp, Zap,
  Phone, Mail, MessageCircle, Home, Settings, Info, Globe,
  Headset, CarFront, Snowflake, Compass, Move, Calendar
};

export const getIcon = (name: string, fallback: any = ThumbsUp) => {
  if (!name) return fallback;
  return availableIcons[name] || fallback;
};
