
-- Ajouter les politiques pour permettre la suppression et modification des réservations par les admins

-- Politiques pour la table bookings (réservations de période)
CREATE POLICY "Allow admin delete bookings" 
ON public.bookings 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

CREATE POLICY "Allow admin update bookings" 
ON public.bookings 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

-- Politiques pour la table normal_bookings (réservations normales)
CREATE POLICY "Allow admin delete normal_bookings" 
ON public.normal_bookings 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

CREATE POLICY "Allow admin update normal_bookings" 
ON public.normal_bookings 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() AND users.role = 'admin'
));
