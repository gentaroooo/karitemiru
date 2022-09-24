class User < ApplicationRecord
  authenticates_with_sorcery!

  mount_uploader :avatar, AvatarUploader

  has_many :books, dependent: :destroy
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy

  has_many :likes, dependent: :destroy
  has_many :likes_posts, through: :likes, source: :post

  validates :password, length: { minimum: 4 }, if: -> { new_record? || changes[:crypted_password] }
  validates :password, confirmation: true, if: -> { new_record? || changes[:crypted_password] }
  validates :password_confirmation, presence: true, if: -> { new_record? || changes[:crypted_password] }
  validates :email, uniqueness: true, presence: true
  validates :name, presence: true, length: { maximum: 16 }
  validates :reset_password_token, presence: true, uniqueness: true, allow_nil: true

  def own?(object)
    id == object.user_id
  end

  def like(post)
    likes_posts << post
  end
 
  def unlike(post)
    likes_posts.destroy(post)
  end
 
  def like?(post)
    likes_posts.include?(post)
  end
end