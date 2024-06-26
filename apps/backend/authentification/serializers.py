from database.models import User, ExpoToken
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .validations import validate_password


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def create(self, clean_data):
        user_obj = User.objects.create_user(**clean_data)
        return user_obj


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'noma')

    def validate_noma(self, value):
        if (value.isdigit and len(value) == 8) or len(value) == 0:
            return value
        raise ValidationError("Le noma doit contenir 8 chiffres")


class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True,
                                     error_messages={"blank": "Le mot de passe ne peut pas être vide"})
    password2 = serializers.CharField(write_only=True, required=True,
                                      error_messages={"blank": "Le mot de passe ne peut pas être vide"})
    old_password = serializers.CharField(write_only=True, required=True,
                                         error_messages={"blank": "Le mot de passe ne peut pas être vide"})

    class Meta:
        model = User
        fields = ('old_password', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Les mots de passe ne correspondent pas"})

        check_password = validate_password(attrs['password'])
        check_password2 = validate_password(attrs['password2'])

        if check_password:
            raise serializers.ValidationError(
                {"error": check_password.data})
        if check_password2:
            raise serializers.ValidationError(
                {"error": check_password2.data})

        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                {"old_password": "L'ancien mot de passe est incorrect"})
        return value

    # @staticmethod
    # def validate_password(value):
    #     return validate_password(value)
    #
    # @staticmethod
    # def validate_password2(value):
    #     validate_password(value)

    def update(self, instance, validated_data):

        instance.set_password(validated_data['password'])
        instance.save()

        return instance


class ExpoTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpoToken
        fields = '__all__'
