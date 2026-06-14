-- ============================================================
-- Script para insertar/actualizar mensajes de ejemplo en el chat
-- Ejecutar: psql -U postgres -d postgres -f src/database/seed-messages.sql
-- ============================================================

-- Limpiar mensajes existentes
TRUNCATE TABLE messages RESTART IDENTITY;

-- Insertar mensajes de conversacion (hora local Colombia UTC-5)
INSERT INTO messages (id, user_id, username, text, created_at) VALUES
(1, 1, 'Administrador', 'Hola', '2026-06-14 12:45:00.029'),
(2, 2, 'Juan Cliente', 'Hola', '2026-06-14 12:45:10.495'),
(3, 2, 'Juan Cliente', 'quiero saber que productos ofrecen?', '2026-06-14 12:48:31.806'),
(4, 1, 'Administrador', 'claro que si', '2026-06-14 12:48:39.058'),
(5, 1, 'Administrador', 'En eco home ofrecemos productos de ecologicos amigables con el medio ambiente', '2026-06-14 12:49:46.888'),
(6, 2, 'Juan Cliente', 'que interesante que clase de productos tienen?', '2026-06-14 12:49:55.843'),
(7, 1, 'Administrador', 'De momento tenemos Vasos de vidrio reciclado, platos biodegrabales, cubiertos de bambu, entre otros? le gustaria saber mas acerca de algun producto?', '2026-06-14 12:50:47.464'),
(8, 2, 'Juan Cliente', 'me interesan los vasos de vidrio reciclados', '2026-06-14 12:51:35.767'),
(9, 1, 'Administrador', 'claro que si esta es la descripcion del producto:', '2026-06-14 12:59:04.629'),
(10, 1, 'Administrador', 'Vaso artesanal hecho con vidrio 100% reciclado', '2026-06-14 12:59:06.338'),
(11, 1, 'Administrador', 'actualmente tenemos disponible 50 unidades', '2026-06-14 12:59:18.252'),
(12, 1, 'Administrador', 'a un precio de 12.99 dolares', '2026-06-14 12:59:37.336'),
(13, 2, 'Juan Cliente', 'entiendo, como puedo hacer la compra?', '2026-06-14 12:59:59.034'),
(14, 1, 'Administrador', 'puede entrar en nuestra pagina, generar la comprar y pagar', '2026-06-14 13:00:26.356'),
(15, 2, 'Juan Cliente', 'muchas gracias', '2026-06-14 13:00:30.610');

-- Actualizar la secuencia del id para que el proximo mensaje sea 16
SELECT setval('messages_id_seq', 15);
